import React, { useState, useCallback } from 'react';

// Reuse the same translator logic class
class BahasaUnangTranslatorLogic {
  private vowels = 'aiueo';
  private consonants = 'bcdfghjklmnpqrstvwxyz';

  splitSyllables(word: string): string[] {
    word = word.toLowerCase();
    const syllables: string[] = [];
    let current = "";

    let i = 0;
    while (i < word.length) {
      const char = word[i];
      current += char;

      if (this.vowels.includes(char)) {
        if (i + 1 < word.length) {
          let j = i + 1;
          let consonantCluster = "";

          while (j < word.length && this.consonants.includes(word[j])) {
            consonantCluster += word[j];
            j++;
          }

          if (j < word.length && this.vowels.includes(word[j])) {
            if (consonantCluster.length === 1) {
              syllables.push(current);
              current = "";
            } else if (consonantCluster.length >= 2) {
              current += consonantCluster[0];
              syllables.push(current);
              current = consonantCluster.slice(1);
              i = j - 1;
            } else {
              syllables.push(current);
              current = "";
            }
          } else {
            current += consonantCluster;
            i = j - 1;
          }
        } else {
          syllables.push(current);
          current = "";
        }
      }

      i++;
    }

    if (current) {
      syllables.push(current);
    }

    return syllables;
  }

  getVowelsFromSyllable(syllable: string): string {
    return syllable.split('').filter(char => this.vowels.includes(char)).join('');
  }

  changeVowelsToA(syllable: string): string {
    return syllable.split('').map(char => 
      this.vowels.includes(char) ? 'a' : char
    ).join('');
  }

  indonesianToUnang(word: string): string {
    word = word.toLowerCase().trim();

    const hasNya = word.endsWith('nya');
    const baseWord = hasNya ? word.slice(0, -3) : word;

    const syllables = this.splitSyllables(baseWord);

    if (!syllables.length) return word;

    if (syllables.length === 1) {
      const syllable = syllables[0];
      const x = this.changeVowelsToA(syllable);
      const c = this.getVowelsFromSyllable(syllable);

      let result = `u${x} n${c}ng`;
      if (hasNya) result += "nya";
      return result;
    }

    const lastSyllable = syllables[syllables.length - 1];
    let remainingSyllables = syllables.slice(0, -1);

    if (remainingSyllables.length > 0) {
      const secondLast = remainingSyllables[remainingSyllables.length - 1];
      if (secondLast && this.consonants.includes(secondLast[secondLast.length - 1])) {
        const consonant = secondLast[secondLast.length - 1];
        remainingSyllables[remainingSyllables.length - 1] = secondLast.slice(0, -1);
        const newLastSyllable = consonant + lastSyllable;
        
        const x = this.changeVowelsToA(newLastSyllable);
        const b = remainingSyllables.join('');
        const c = this.getVowelsFromSyllable(newLastSyllable);

        let result = b ? `u${x} ${b}n${c}ng` : `u${x} n${c}ng`;
        if (hasNya) result += "nya";
        return result;
      }
    }

    const x = this.changeVowelsToA(lastSyllable);
    const b = remainingSyllables.join('');
    const c = this.getVowelsFromSyllable(lastSyllable);

    let result = b ? `u${x} ${b}n${c}ng` : `u${x} n${c}ng`;
    if (hasNya) result += "nya";
    return result;
  }

  translateSentence(sentence: string, toUnang: boolean = true): string {
    if (toUnang) {
      return sentence.split(/\s+/).map(word => {
        const cleanWord = word.replace(/[^\w]/g, '');
        const punctuation = word.replace(/[\w]/g, '');
        return cleanWord ? this.indonesianToUnang(cleanWord) + punctuation : word;
      }).join(' ');
    }
    // For brevity, simplified reverse translation
    return sentence;
  }
}

interface TranslatorWidgetProps {
  className?: string;
}

const TranslatorWidget: React.FC<TranslatorWidgetProps> = ({ className = '' }) => {
  const [inputText, setInputText] = useState('');
  const [outputText, setOutputText] = useState('');

  const translator = new BahasaUnangTranslatorLogic();

  const translate = useCallback(() => {
    if (!inputText.trim()) {
      setOutputText('');
      return;
    }

    const result = translator.translateSentence(inputText, true);
    setOutputText(result);
  }, [inputText, translator]);

  React.useEffect(() => {
    translate();
  }, [translate]);

  return (
    <div className={`bg-white rounded-lg shadow-md p-6 ${className}`}>
      <h3 className="text-xl font-semibold mb-4 text-gray-800">
        Bahasa Unang Translator
      </h3>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Indonesian
          </label>
          <input
            type="text"
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Type Indonesian text..."
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Bahasa Unang
          </label>
          <input
            type="text"
            className="w-full p-3 border border-gray-300 rounded-lg bg-gray-50"
            value={outputText}
            readOnly
            placeholder="Translation will appear here..."
          />
        </div>
        
        <div className="text-center">
          <a
            href="/translator"
            className="inline-block bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
          >
            Open Full Translator
          </a>
        </div>
      </div>
    </div>
  );
};

export default TranslatorWidget;