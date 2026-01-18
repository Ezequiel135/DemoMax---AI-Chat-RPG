
import { Component, inject, signal, effect, ElementRef, ViewChild, ChangeDetectionStrategy, OnDestroy, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CharacterService } from '../../services/character.service';
import { GeminiService } from '../../services/gemini.service';
import { EconomyService } from '../../services/economy.service';
import { ChatHistoryService, ToolEntry } from '../../services/chat-history.service';
import { ToastService } from '../../services/toast.service';
import { AuthService } from '../../services/auth.service';
import { AffinityService } from '../../services/affinity.service';
import { PhoneGeneratorService } from '../../services/ai/phone-generator.service';
import { ActivityService } from '../../services/activity.service'; 
import { AiMemoryService } from '../../services/ai/ai-memory.service';
import { MoodService, DailyState } from '../../services/simulation/mood.service'; 
import { LifeSimulationService } from '../../services/simulation/life-simulation.service'; 
import { ChatSettingsService } from '../../services/chat-settings.service'; 
import { PersonaService } from '../../services/persona.service'; 
import { VoiceService } from '../../services/voice.service';
import { Character } from '../../models/character.model';
import { Message } from '../../models/message.model';
import { PhoneData } from '../../models/phone-content.model';
import { ImageGenModalComponent } from '../../components/ui/image-gen-modal.component';
import { PixDonateModalComponent } from '../../components/ui/pix-donate-modal.component';
import { ChatToolsMenuComponent } from '../../components/chat/chat-tools-menu.component';
import { AffinityModalComponent } from '../../components/chat/affinity-modal.component';
import { ChatModesModalComponent } from '../../components/chat/chat-modes-modal.component';
import { PhoneSimulatorComponent } from '../../components/chat/phone-simulator.component';
import { CharacterProfileModalComponent } from '../../components/chat/character-profile-modal.component';
import { ChatOptionsMenuComponent } from '../../components/chat/settings/chat-options-menu.component'; 
import { ChatSettingsModalComponent } from '../../components/chat/settings/chat-settings-modal.component'; 
import { ChatMainMenuComponent } from '../../components/chat/menus/chat-main-menu.component'; 
import { PersonaSelectorComponent } from '../../components/chat/settings/persona-selector.component'; 
import { ChatInterruptionLogic } from '../../logic/chat/interaction/interruption.logic';
import { FinancialTrackerLogic } from '../../logic/chat/analysis/financial-tracker.logic';
import { MessageSenderWorkflow } from '../../logic/chat/workflow/message-sender.workflow';
import { generateUUID } from '../../logic/core/uuid.logic';
import { parseChatMessage } from '../../logic/chat/formatting/message-parser.logic';
import { replaceChatPlaceholders } from '../../logic/chat/formatting/placeholder.logic';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [
    CommonModule, FormsModule, RouterLink, 
    ImageGenModalComponent, PixDonateModalComponent,
    ChatToolsMenuComponent, AffinityModalComponent, ChatModesModalComponent,
    PhoneSimulatorComponent, CharacterProfileModalComponent,
    ChatOptionsMenuComponent, ChatSettingsModalComponent,
    ChatMainMenuComponent, PersonaSelectorComponent
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
  memoryService = inject(AiMemoryService);
  toastService = inject(ToastService);
  affinityService = inject(AffinityService);
  phoneService = inject(PhoneGeneratorService);
  activityService = inject(ActivityService);
  moodService = inject(MoodService); 
  lifeSimService = inject(LifeSimulationService); 
  chatSettings = inject(ChatSettingsService); 
  personaService = inject(PersonaService); 
  voiceService = inject(VoiceService); 

  private characterId = signal<string>('');
  
  character = computed(() => {
    const id = this.characterId();
    if (!id) return undefined;
    return this.characterService.getCharacterSignal(id)();
  });

  messages = signal<Message[]>([]);
  toolHistory = signal<ToolEntry[]>([]); 
  inputText = signal<string>('');
  isLoading = signal<boolean>(false);
  
  dailyState = signal<DailyState | null>(null);
  
  showToolsMenu = signal(false);
  showAffinityModal = signal(false);
  showChatModeModal = signal(false);
  showImageGenModal = signal(false);
  showPixModal = signal(false);
  showCharacterProfile = signal(false);
  showMainMenu = signal(false); 
  showPersonaModal = signal(false); 
  showVisualSettingsModal = signal(false); 
  
  activeToolModal = signal<'phone_confirm' | 'diary' | 'dream' | 'memory' | 'forum' | 'history' | null>(null);
  showPhoneModal = signal(false);
  phoneData = signal<PhoneData | null>(null);
  isPhoneLoading = signal(false);
  isPhoneAllowed = signal(false);

  selectedCalendarDate = signal<string | null>(null); 

  @ViewChild('scrollContainer') private scrollContainer!: ElementRef;
  @ViewChild('messageInput') private messageInput!: ElementRef<HTMLTextAreaElement>;

  backgroundStyle = computed(() => {
    const bg = this.chatSettings.getWallpaperValue(this.chatSettings.currentSettings().wallpaperId);
    return bg ? (bg.includes('url') ? bg : bg) : '';
  });

  decorationStyle = computed(() => {
    return this.chatSettings.getDecorationClasses(this.chatSettings.currentSettings().decorationId);
  });

  constructor() {
    this.route.paramMap.subscribe(params => {
       const id = params.get('id');
       if (id) {
         this.characterId.set(id);
         const char = this.characterService.getCharacterById(id);
         if (char) {
           this.chatSettings.loadSettings(char.id);
           this.loadChatData(char);
         } else {
           this.router.navigate(['/home']);
         }
       }
    });

    effect(() => {
      const len = this.messages().length;
      if (len > 0) setTimeout(() => this.scrollToBottom(), 50);
    });

    effect(() => {
      const char = this.character();
      const msgs = this.messages();
      if (char && msgs.length > 0) {
        const data = this.historyService.getChatData(char.id);
        this.historyService.saveChatData(char.id, msgs, data.summary, this.toolHistory(), this.phoneData() || data.phoneData);
      }
    });
  }

  ngOnDestroy() {
    this.voiceService.cancel();
  }

  private replacePlaceholders(text: string): string {
    const currentPersona = this.personaService.activePersona();
    const userName = currentPersona ? currentPersona.name : (this.auth.currentUser()?.username || 'User');
    return replaceChatPlaceholders(text, this.character(), userName);
  }

  async loadChatData(char: Character) {
    const chatData = this.historyService.getChatData(char.id);
    let currentMessages = chatData.messages;
    
    if (currentMessages.length === 0) {
       this.dailyState.set(this.moodService.getInitialState(char));
       let introText = char.firstMessage ? this.replacePlaceholders(char.firstMessage) : `*${char.name} notices you.*`;
       
       const initialMsg: Message = {
          id: generateUUID(), role: 'model', text: introText, timestamp: Date.now()
       };
       currentMessages = [initialMsg];
       this.historyService.saveChatData(char.id, currentMessages, chatData.summary);
    } else {
       this.lifeSimService.processLifeCycle(char);
       this.dailyState.set(this.moodService.getCharacterState(char));
    }

    this.messages.set(currentMessages);
    this.toolHistory.set(chatData.toolHistory || []);
    if (chatData.phoneData) this.phoneData.set(chatData.phoneData);
  }

  async sendMessage() {
    if (this.isLoading() || !this.inputText().trim()) return;
    
    const text = this.inputText();
    this.inputText.set('');
    this.addMessage('user', text);
    this.isLoading.set(true);

    const char = this.character();
    if (char) {
        const result = await MessageSenderWorkflow.execute(text, char, this.dailyState(), {
            character: this.characterService,
            economy: this.economyService,
            activity: this.activityService,
            gemini: this.geminiService,
            history: this.historyService,
            memory: this.memoryService, 
            persona: this.personaService,
            settings: this.chatSettings,
            auth: this.auth
        });

        if (result.updatedDailyState) this.dailyState.set(result.updatedDailyState);
        if (result.feedback) this.toastService.show(result.feedback.message, result.feedback.type);
        
        if (result.aiMessage) {
            this.addMessage('model', result.aiMessage.text);
        } else {
            this.addMessage('model', '(Error: Neural Link Unstable. Try again.)');
        }
    }
    this.isLoading.set(false);
  }

  addMessage(role: 'user' | 'model', text: string, attachmentUrl?: string) {
    this.messages.update(msgs => [...msgs, { 
      id: generateUUID(), 
      role, 
      text, 
      timestamp: Date.now(),
      attachmentUrl 
    }]);
    
    if (role === 'model' && this.chatSettings.currentSettings().autoVoice) {
       const char = this.character();
       const gender = char?.gender === 'Male' ? 'male' : 'female';
       const spokenText = text.replace(/\*[^*]+\*/g, '').trim(); 
       if (spokenText) this.voiceService.speak(spokenText, gender);
    }
  }

  handleImageSelection(imageUrl: string) {
    // 1. Adiciona a mensagem visual
    this.addMessage('user', 'Enviei uma imagem.', imageUrl);
    
    // 2. Dispara reação da IA com prompt de sistema invisível
    // Como não temos multimodal real para histórico passado, explicamos o que aconteceu no prompt
    this.triggerSystemReaction(`[SYSTEM: USER SENT AN IMAGE] 
    The user just sent you a photo. Assume it is relevant to the conversation or a selfie. 
    React to receiving an image. Describe what you see based on context or ask what it is if unclear.`);
  }

  handleMenuAction(action: string) {
    this.showMainMenu.set(false); 
    switch(action) {
      case 'profile': this.showCharacterProfile.set(true); break;
      case 'persona': this.showPersonaModal.set(true); break;
      case 'modes': this.showChatModeModal.set(true); break;
      case 'affinity': this.showAffinityModal.set(true); break;
      case 'visuals': this.showVisualSettingsModal.set(true); break;
      case 'new_chat':
        if(confirm('Iniciar novo chat? Isso arquiva a memória atual.')) {
           this.messages.set([]);
           this.historyService.clearHistory(this.character()!.id); 
           this.loadChatData(this.character()!); 
        }
        break;
      case 'reset': 
        if (confirm('⚠️ RESET TOTAL: Apagar toda a memória deste personagem?')) {
           this.historyService.clearHistory(this.character()!.id);
           this.characterService.updateAffinity(this.character()!.id, 0);
           location.reload();
        }
        break;
    }
  }

  async handleToolAction(action: string) {
    this.showToolsMenu.set(false);
    const char = this.character();
    
    if (char && ['phone', 'diary'].includes(action)) {
       const check = ChatInterruptionLogic.checkAccess(char, action as any, this.messages(), this.dailyState());
       if (check.status === 'DENIED' || check.status === 'CAUGHT') {
          if (check.systemPrompt) this.triggerSystemReaction(check.systemPrompt);
          return; 
       }
    }

    switch (action) {
      case 'photo': 
        this.showImageGenModal.set(true); 
        break;
      case 'phone': 
        if (this.phoneData()) {
           this.showPhoneModal.set(true);
           const lastMsg = this.messages().filter(m => m.role === 'model').pop()?.text || '';
           this.isPhoneAllowed.set(ChatInterruptionLogic.hasExplicitConsent(lastMsg));
        } else {
           this.activeToolModal.set('phone_confirm'); 
        }
        break;
      case 'thought': await this.generateContent('thought'); break;
      case 'diary': 
        this.activeToolModal.set('diary');
        this.selectedCalendarDate.set(new Date().toISOString().split('T')[0]);
        this.generateContent('diary');
        break;
      case 'dream': 
        this.activeToolModal.set('dream');
        await this.generateContent('dream');
        break;
      case 'memory': this.activeToolModal.set('memory'); break;
      case 'history': this.activeToolModal.set('history'); break;
      case 'forum':
        this.activeToolModal.set('forum');
        await this.generateContent('forum');
        break;
    }
  }

  async generateContent(type: 'diary' | 'dream' | 'thought' | 'forum') {
    const char = this.character();
    if (!char) return;
    
    this.isLoading.set(true);
    try {
       let instruction = '';
       switch(type) {
          case 'diary': instruction = `Write a diary entry for today from ${char.name}'s perspective. Reflect on recent interactions with the User. Keep it secret and personal. Use date: ${new Date().toLocaleDateString()}.`; break;
          case 'dream': instruction = `Describe a dream ${char.name} had last night. It should be abstract, symbolic, and related to their fears or desires (and maybe the User).`; break;
          case 'forum': instruction = `Write a social media post (Twitter/Reddit style) that ${char.name} would post right now. Include hashtags. It can be vagueposting about the user.`; break;
          case 'thought': instruction = `Reveal ${char.name}'s internal monologue right now. What are they thinking but not saying?`; break;
       }

       const chat = await this.geminiService.createChatSession(char.id, instruction, 'flash', this.messages().slice(-10));
       const result = await this.geminiService.sendMessage(chat, 'Generate now.');
       
       if (type === 'thought') {
          this.addMessage('model', `💭 *Pensamento:* ${result}`);
       } else {
          const entry: ToolEntry = { 
             id: generateUUID(), type, content: result, timestamp: Date.now(), dateRef: new Date().toISOString().split('T')[0] 
          };
          this.toolHistory.update(h => [entry, ...h]); 
          this.historyService.addToolEntry(char.id, entry); 
       }
    } finally { this.isLoading.set(false); }
  }

  async triggerSystemReaction(prompt: string) {
     this.isLoading.set(true);
     try {
        const chat = await this.geminiService.createChatSession(this.character()!.id, prompt, 'flash', this.messages());
        const response = await this.geminiService.sendMessage(chat, "REACT NOW");
        this.addMessage('model', response);
     } finally { this.isLoading.set(false); }
  }

  async unlockPhone() {
    this.activeToolModal.set(null);
    if (this.phoneData()) { this.showPhoneModal.set(true); return; }
    
    if (!this.economyService.spendCoins(60)) { 
      this.toastService.show("Moedas Insuficientes! (Custo: 60)", "error"); return;
    }
    this.toastService.show("-60 Sakura Coins. Hackeando...", "success");
    await this.refreshPhoneData();
  }

  async refreshPhoneData() {
    this.isPhoneLoading.set(true);
    try {
        const financialContext = FinancialTrackerLogic.analyzeFinancialContext(this.messages());
        const data = await this.phoneService.hackPhone(this.character()!, financialContext);
        if (data) {
          this.phoneData.set(data);
          this.historyService.savePhoneData(this.character()!.id, data);
          this.showPhoneModal.set(true);
          this.isPhoneAllowed.set(false);
        }
    } finally {
        this.isPhoneLoading.set(false);
    }
  }

  handleCaught(type: string) {
    this.showPhoneModal.set(false);
    const char = this.character();
    if (char) {
       this.characterService.updateAffinity(char.id, char.affinity - 15);
       const prompt = ChatInterruptionLogic.buildEmbarrassingCaughtPrompt(char, 'phone');
       this.triggerSystemReaction(prompt);
    }
  }

  getHistoryForType(type: any) { return this.toolHistory().filter(h => h.type === type); }
  toggleToolsMenu() { this.showToolsMenu.update(v => !v); }
  handleEnter(e: KeyboardEvent) { if (!e.shiftKey) { e.preventDefault(); this.sendMessage(); } }
  autoGrow(e: any) { e.target.style.height = 'auto'; e.target.style.height = Math.min(e.target.scrollHeight, 120) + 'px'; }
  parseMessage(text: string) { return parseChatMessage(text); }
  scrollToBottom() { try { this.scrollContainer.nativeElement.scrollTop = this.scrollContainer.nativeElement.scrollHeight; } catch(err) {} }
}
