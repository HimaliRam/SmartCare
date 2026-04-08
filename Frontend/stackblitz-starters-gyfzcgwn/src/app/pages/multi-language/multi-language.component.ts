import { Component } from '@angular/core';
import { CommonModule } from '@angular/common'; // ✅ ADD THIS
import { LanguageService } from '../../services/language.service';

@Component({
  selector: 'app-multi-language',
  standalone: true,

  // ✅ ADD THIS LINE
  imports: [CommonModule],

  templateUrl: './multi-language.component.html',
  styleUrls: ['./multi-language.component.css'],
})
export class MultiLanguageComponent {
  selectedLanguage = 'en';
  data: any;

  constructor(private languageService: LanguageService) {
    this.loadLanguage();
  }

  ngOnInit() {
    // Restore previously selected language if available
    const savedLang = localStorage.getItem('selectedLanguage');
    if (savedLang) {
      this.selectedLanguage = savedLang;
      this.changeLanguage(savedLang, false); // pass false to avoid saving again
    }
  }

  changeLanguage(lang: string, save = true) {

    this.selectedLanguage = lang;

    if (save) {
      localStorage.setItem('selectedLanguage', lang);
    }

    const select = document.querySelector('.goog-te-combo') as HTMLSelectElement;

    if (select) {
      select.value = lang;
      select.dispatchEvent(new Event('change'));
    } else {
      console.warn("Translate not loaded yet");
    }
  }

  loadLanguage() {
    this.data = this.languageService.getTranslation();
  }
}