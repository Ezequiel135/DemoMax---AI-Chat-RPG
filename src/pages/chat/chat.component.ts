
import { Component, inject, signal, effect, ElementRef, ViewChild, ChangeDetectionStrategy, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CharacterService } from '../../services/character.service';
import { GeminiService } from '../../services/gemini.service';
import { EconomyService } from '../../services/economy.service';
import { ChatHistoryService, ToolEntry } from '../../services/chat-history.service';
import { NetworkService } from '../../services/network.service';
import { ToastService } from '../../services/toast.service';
import { AuthService } from '../../services/auth.service';
import { AffinityService } from '../../services/affinity.service';
import { PhoneGeneratorService } from '../../services/ai/phone-generator.service';
import { ActivityService } from '../../services/activity.service'; 
import { Character } from '../../models/character.model';
import { Message } from '../../models/message.model';
import { PhoneData } from '../../models/phone-content.model';
import { Chat } from '@google/genai';
import { ImageGenModalComponent } from '../../components/ui/image-gen-modal.component';
import { PixDonateModalComponent } from '../../components/ui/pix-donate-modal.component';
import { ChatToolsMenuComponent } from '../../components/chat/chat-tools-menu.component';
import { AffinityModalComponent } from '../../components/chat/affinity-modal.component';
import { ChatModesModalComponent } from '../../components/chat/chat-modes-modal.component';
import { PhoneSimulatorComponent } from '../../components/chat/phone-simulator.component';
import { CharacterProfileModalComponent } from '../../components/chat/character-profile-modal.component';
import { buildSystemPrompt } from '../../logic/prompt-builder.logic';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [
    CommonModule, FormsModule, RouterLink, 
    ImageGenModalComponent, PixDonateModalComponent,
    ChatToolsMenuComponent, AffinityModalComponent, ChatModesModalComponent,
    PhoneSimulatorComponent, CharacterProfileModalComponent
  ],
  templateUrl: './chat.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChatComponent implements OnDestroy {
  route = inject(ActivatedRoute);
  router = inject(Router);
  auth = inject(AuthService); 
  characterService = inject(CharacterService);
  geminiService = inject(GeminiService);
  economyService = inject(EconomyService);
  historyService = inject(ChatHistoryService);
  toastService = inject(ToastService);
  affinityService = inject(AffinityService);
  networkService = inject(NetworkService);
  phoneService = inject(PhoneGeneratorService);
  activityService = inject(ActivityService);

  // State
  character = signal<Character | undefined>(undefined);
  messages = signal<Message[]>([]);
  toolHistory = signal<ToolEntry[]>([]); // New: Stores tool history locally
  inputText = signal<string>('');
  isLoading = signal<boolean>(false);
  
  // UI Toggles
  showToolsMenu = signal(false);
  showAffinityModal = signal(false);
  showChatModeModal = signal(false);
  showImageGenModal = signal(false);
  showPixModal = signal(false);
  showCharacterProfile = signal(false);
  
  // Dynamic Content Modals
  activeToolModal = signal<'phone_confirm' | 'diary' | 'dream' | 'memory' | 'forum' | 'history' | null>(null);
  
  // Phone State
  showPhoneModal = signal(false);
  phoneData = signal<PhoneData | null>(null);
  isPhoneLoading = signal(false);

  private chatSession: Chat | null = null;
  @ViewChild('scrollContainer') private scrollContainer!: ElementRef;
  @ViewChild('messageInput') private messageInput!: ElementRef<HTMLTextAreaElement>;

  constructor() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      const char = this.characterService.getCharacterById(id);
      if (char) {
        this.character.set(char);
        this.loadChatData(char);
        // REMOVED: this.activityService.trackChat(char); 
        // Logic moved to sendMessage to ensure user actually interacted
      } else {
        this.router.navigate(['/']);
      }
    }

    effect(() => {
      this.messages(); 
      setTimeout(() => this.scrollToBottom(), 50);
    });

    effect(() => {
      if (this.character()) {
        // Save both messages and tool history
        this.historyService.saveChatData(this.character()!.id, this.messages(), '', this.toolHistory());
      }
    });
  }

  ngOnDestroy() {
    // Note: We deliberately DO NOT destroy the chatSession here.
    // It remains in the GeminiService cache for pausing/resuming.
  }

  async loadChatData(char: Character) {
    const chatData = this.historyService.getChatData(char.id);
    this.messages.set(chatData.messages);
    this.toolHistory.set(chatData.toolHistory || []);
    
    const userName = this.auth.currentUser()?.username || 'User';
    const prompt = buildSystemPrompt(char, userName, chatData.summary);
    
    // Resume session from cache or create new one, keyed by Character ID
    this.chatSession = await this.geminiService.createChatSession(char.id, prompt);

    if (chatData.messages.length === 0) {
      const intro = `*${char.name} notices you.* "Greetings."`;
      this.addMessage('model', intro);
    }
  }

  toggleToolsMenu() {
    this.showToolsMenu.update(v => !v);
  }

  async handleToolAction(action: string) {
    this.showToolsMenu.set(false);
    
    switch (action) {
      case 'photo': 
        this.showImageGenModal.set(true); 
        break;
      
      case 'phone': 
        this.activeToolModal.set('phone_confirm'); 
        break;
      
      case 'thought':
        await this.generateContent('thought');
        break;

      case 'diary': 
        this.activeToolModal.set('diary');
        // Only generate automatically if empty, otherwise show history
        if (this.getHistoryForType('diary').length === 0) {
           await this.generateContent('diary');
        }
        break;

      case 'dream': 
        this.activeToolModal.set('dream');
        if (this.getHistoryForType('dream').length === 0) {
           await this.generateContent('dream');
        }
        break;
      
      case 'memory': 
        this.generateMemorySummary();
        this.activeToolModal.set('memory'); 
        break;
        
      case 'history':
        this.activeToolModal.set('history');
        break;

      case 'forum':
        this.activeToolModal.set('forum');
        if (this.getHistoryForType('forum').length === 0) {
           await this.generateContent('forum');
        }
        break;
    }
  }

  // Helper to filter history for the modal
  getHistoryForType(type: 'diary' | 'dream' | 'thought' | 'forum'): ToolEntry[] {
    return this.toolHistory().filter(h => h.type === type);
  }

  // --- UNIFIED GENERATION LOGIC ---

  async generateContent(type: 'diary' | 'dream' | 'thought' | 'forum') {
    if (!this.chatSession) return;
    this.isLoading.set(true);

    try {
       // 1. Get Context from previous entries to maintain realism
       const previousEntries = this.getHistoryForType(type).slice(0, 3).map(e => e.content).join('\n---\n');
       const contextPrompt = previousEntries ? `[PREVIOUS ENTRIES FOR CONTEXT]:\n${previousEntries}\n\n` : '';

       let prompt = '';
       if (type === 'diary') {
         prompt = `${contextPrompt}[TASK] Write a new secret diary entry (max 100 words) for ${this.character()?.name}. Reflect on the latest interactions with the user. Show hidden feelings/secrets. Make it distinct from previous entries.`;
       } else if (type === 'dream') {
         prompt = `${contextPrompt}[TASK] Describe a new, vivid, symbolic dream ${this.character()?.name} had. Max 80 words. Abstract and mysterious.`;
       } else if (type === 'forum') {
         prompt = `${contextPrompt}[TASK] Generate a social media thread (simulation) where people are talking about ${this.character()?.name} or the user. Include timestamps.`;
       } else if (type === 'thought') {
         // Thoughts are instant, cost money, and are added to chat
         if (!this.economyService.spendCoins(10)) {
            this.toastService.show("Costs 10 SC to read thoughts!", "error");
            this.isLoading.set(false);
            return;
         }
         prompt = `[TASK] Reveal ${this.character()?.name}'s current internal monologue right now regarding the user. Raw and unfiltered.`;
       }

       // 2. Generate
       const result = await this.geminiService.sendMessage(this.chatSession, prompt);

       // 3. Save to History
       if (type !== 'thought') {
          const entry: ToolEntry = {
             id: Date.now().toString(),
             type,
             content: result,
             timestamp: Date.now()
          };
          
          this.toolHistory.update(h => [entry, ...h]); // Add to local signal
          this.historyService.addToolEntry(this.character()!.id, entry); // Persist
       } else {
          // Thoughts go directly to chat as a special message
          this.addMessage('model', `💭 *Inner Thought:* ${result}`);
       }

       // 4. INJECT KNOWLEDGE (The "Embarrassment" Protocol)
       // We tell the AI that the user saw this, so it reacts realistically if mentioned.
       const injectionMsg = `[SYSTEM EVENT: The User has successfully bypassed privacy protocols and READ your private ${type.toUpperCase()}: "${result}". You are now aware that they know this information. If the user mentions this content, you MUST react realistically (e.g., extreme embarrassment, anger, defensiveness, or shyness) depending on your personality. Do not mention this system event, just act the part.]`;
       
       // Send silently to Gemini (don't add to UI)
       await this.geminiService.sendMessage(this.chatSession, injectionMsg);

    } finally { 
       this.isLoading.set(false); 
    }
  }

  generateMemorySummary() {
    // Just a visual representation for the modal
    const entry: ToolEntry = {
       id: 'mem_' + Date.now(),
       type: 'memory' as any, // Visual type
       content: "Neural Link Established.\nShort-term buffer active.\nLong-term engrams syncing...",
       timestamp: Date.now()
    };
    // We don't save memory summary to history like others, it's just a view
  }

  // --- PHONE LOGIC ---
  async unlockPhone() {
    this.activeToolModal.set(null);
    
    if (!this.economyService.spendCoins(60)) {
      this.toastService.show("Insufficient Sakura Coins!", "error");
      return;
    }

    this.isPhoneLoading.set(true);
    this.toastService.show("Hacking Device... Please Wait", "info", 2000);

    const data = await this.phoneService.hackPhone(this.character()!);
    
    this.isPhoneLoading.set(false);
    if (data) {
      this.phoneData.set(data);
      this.showPhoneModal.set(true);
      
      // Inject knowledge of phone hack
      if (this.chatSession) {
         this.geminiService.sendMessage(this.chatSession, `[SYSTEM EVENT: User HACKED your phone and saw your gallery/messages. React accordingly if they bring it up.]`);
      }

    } else {
      this.toastService.show("Connection Failed. Refund issued.", "error");
      this.economyService.earnCoins(60); 
    }
  }

  async sendMessage() {
    if (this.isLoading() || !this.inputText().trim()) return;
    
    const text = this.inputText();
    this.inputText.set('');
    this.resetInputHeight();
    this.addMessage('user', text);
    this.isLoading.set(true);

    if (this.character()) {
       this.character()!.affinity += 1;
       this.economyService.addXp(5);
       // Track activity ONLY here (when user actually sends a message)
       this.activityService.trackChat(this.character()!);
    }

    try {
      if (this.chatSession) {
        const response = await this.geminiService.sendMessage(this.chatSession, text);
        this.addMessage('model', response);
      }
    } catch (e) {
      this.addMessage('model', '(Connection failed...)');
    } finally {
      this.isLoading.set(false);
    }
  }

  addMessage(role: 'user' | 'model', text: string) {
    this.messages.update(msgs => [...msgs, { id: Date.now().toString(), role, text, timestamp: Date.now() }]);
  }

  parseMessage(text: string): { type: 'text' | 'action', content: string }[] {
    const parts: { type: 'text' | 'action', content: string }[] = [];
    const regex = /\*([^*]+)\*/g;
    let lastIndex = 0;
    let match;

    while ((match = regex.exec(text)) !== null) {
       if (match.index > lastIndex) {
          parts.push({ type: 'text', content: text.substring(lastIndex, match.index) });
       }
       parts.push({ type: 'action', content: match[1] });
       lastIndex = regex.lastIndex;
    }
    if (lastIndex < text.length) {
       parts.push({ type: 'text', content: text.substring(lastIndex) });
    }
    return parts;
  }

  handleEnter(e: KeyboardEvent) {
     if (!e.shiftKey) {
        e.preventDefault();
        this.sendMessage();
     }
  }

  autoGrow(e: any) {
    const el = e.target;
    el.style.height = 'auto';
    el.style.height = Math.min(el.scrollHeight, 120) + 'px';
  }

  resetInputHeight() {
    if (this.messageInput?.nativeElement) {
      this.messageInput.nativeElement.style.height = 'auto';
    }
  }

  scrollToBottom() {
    try { this.scrollContainer.nativeElement.scrollTop = this.scrollContainer.nativeElement.scrollHeight; } catch(err) {}
  }
}
