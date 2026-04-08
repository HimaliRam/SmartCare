import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class LanguageService {

    private currentLanguage = 'en';

    private translations: any = {

        en: {
            title: "Multi-language Support",
            subtitle: "Access SmartCare in your preferred language",
            description: "SmartCare provides seamless healthcare access in multiple languages for better understanding and user comfort.",
            select: "Select Language",
            features: [
                "View health reports in your language",
                "AI assistant supports multiple languages",
                "Easy navigation and accessibility",
                "Improved patient communication",
                "Better healthcare experience"
            ]
        },

        hi: {
            title: "बहुभाषा समर्थन",
            subtitle: "अपनी पसंदीदा भाषा में SmartCare का उपयोग करें",
            description: "SmartCare कई भाषाओं में स्वास्थ्य सेवाएं प्रदान करता है।",
            select: "भाषा चुनें",
            features: [
                "अपनी भाषा में स्वास्थ्य रिपोर्ट देखें",
                "AI सहायक कई भाषाओं का समर्थन करता है",
                "आसान उपयोग और नेविगेशन",
                "बेहतर मरीज संचार",
                "उन्नत स्वास्थ्य अनुभव"
            ]
        },

        gu: {
            title: "બહુભાષી સપોર્ટ",
            subtitle: "તમારી પસંદગીની ભાષામાં SmartCare નો ઉપયોગ કરો",
            description: "SmartCare અનેક ભાષાઓમાં આરોગ્ય સેવાઓ આપે છે.",
            select: "ભાષા પસંદ કરો",
            features: [
                "તમારી ભાષામાં આરોગ્ય રિપોર્ટ જુઓ",
                "AI સહાયક બહુભાષી છે",
                "સરળ ઉપયોગ અને નેવિગેશન",
                "સારો દર્દી સંચાર",
                "ઉત્તમ આરોગ્ય અનુભવ"
            ]
        }

    };

    setLanguage(lang: string) {
        this.currentLanguage = lang;
    }

    getLanguage() {
        return this.currentLanguage;
    }

    getTranslation() {
        return this.translations[this.currentLanguage];
    }

}