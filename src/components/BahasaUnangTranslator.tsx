import React, { useState, useCallback, useEffect } from 'react';

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

  unangToIndonesian(unangText: string): string {
    unangText = unangText.toLowerCase().trim();

    const hasNya = unangText.endsWith('nya');
    if (hasNya) {
      unangText = unangText.slice(0, -3);
    }

    const parts = unangText.split(' ');

    if (parts.length < 2 || !parts[0].startsWith('u')) {
      return unangText;
    }

    const xPart = parts[0].slice(1);
    const secondPart = parts[1];

    if (!secondPart.endsWith('ng')) {
      return unangText;
    }

    let c, b;
    const match = secondPart.match(/n([aiueo]*)ng$/);
    if (match) {
      c = match[1];
      b = secondPart.slice(0, match.index || 0);
    } else {
      return unangText;
    }

    let originalLastSyllable = "";
    let cIndex = 0;

    for (const char of xPart) {
      if (char === 'a' && cIndex < c.length) {
        originalLastSyllable += c[cIndex];
        cIndex++;
      } else {
        originalLastSyllable += char;
      }
    }

    let result = b + originalLastSyllable;
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
    } else {
      const words = sentence.split(/\s+/);
      const translatedWords: string[] = [];
      let i = 0;

      while (i < words.length) {
        const word = words[i];
        const cleanWord = word.replace(/[^\w]/g, '');
        const punctuation = word.replace(/[\w]/g, '');

        if (cleanWord.startsWith('u') && i + 1 < words.length) {
          const nextWord = words[i + 1];
          const cleanNextWord = nextWord.replace(/[^\w]/g, '');
          const nextPunctuation = nextWord.replace(/[\w]/g, '');

          if (cleanNextWord.endsWith('ng') || cleanNextWord.endsWith('ngnya')) {
            const unangPhrase = cleanWord + ' ' + cleanNextWord;
            const translated = this.unangToIndonesian(unangPhrase);
            translatedWords.push(translated + punctuation + nextPunctuation);
            i += 2;
          } else {
            translatedWords.push(word);
            i += 1;
          }
        } else {
          translatedWords.push(word);
          i += 1;
        }
      }

      return translatedWords.join(' ');
    }
  }
}

const BahasaUnangTranslator: React.FC = () => {
  const [inputText, setInputText] = useState('');
  const [outputText, setOutputText] = useState('');
  const [isIndonesianToUnang, setIsIndonesianToUnang] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const translator = new BahasaUnangTranslatorLogic();

  const translate = useCallback(() => {
    const inputValue = inputText.trim();
    
    if (!inputValue) {
      setOutputText('');
      return;
    }

    try {
      setIsLoading(true);
      
      setTimeout(() => {
        try {
          const result = translator.translateSentence(inputValue, isIndonesianToUnang);
          setOutputText(result);
        } catch (error) {
          setOutputText('Translation error occurred');
          console.error('Translation error:', error);
        } finally {
          setIsLoading(false);
        }
      }, 100);
    } catch (error) {
      setOutputText('Translation error occurred');
      setIsLoading(false);
      console.error('Translation error:', error);
    }
  }, [inputText, isIndonesianToUnang]);

  const clear = () => {
    setInputText('');
    setOutputText('');
  };

  const copyResult = async () => {
    if (!outputText) return;

    try {
      await navigator.clipboard.writeText(outputText);
      // You could add a toast notification here
    } catch (err) {
      console.error('Failed to copy: ', err);
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = outputText;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
    }
  };

  const swapLanguages = () => {
    setIsIndonesianToUnang(!isIndonesianToUnang);
    const temp = inputText;
    setInputText(outputText);
    setOutputText(temp);
  };

  const handleExampleClick = (word: string) => {
    setInputText(word);
  };

  // Auto-translate when input changes
  useEffect(() => {
    translate();
  }, [translate]);

  const examples = [
    { word: 'hancur', translation: 'uncar hanung' },
    { word: 'lari', translation: 'ura laning' },
    { word: 'siapa', translation: 'upa sianang' },
    { word: 'sebentar', translation: 'untar sebenang' },
    { word: 'gua', translation: 'ua gunang' },
    { word: 'buat', translation: 'uat bunang' },
  ];

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-5">
      <div className="bg-white rounded-2xl shadow-2xl p-10 w-full max-w-4xl border border-gray-200">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-gray-800 mb-3 bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
            Bahasa Unang Translator
          </h1>
          <p className="text-lg text-gray-600">
            Translate between Indonesian and Bahasa Unang
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 items-start mb-8">
          <div className="flex flex-col">
            <label className="font-semibold text-gray-700 mb-3 text-lg">
              {isIndonesianToUnang ? 'Indonesian' : 'Bahasa Unang'}
            </label>
            <textarea
              className="w-full min-h-[150px] p-4 border-2 border-gray-200 rounded-xl text-base leading-relaxed resize-none transition-all duration-300 focus:outline-none focus:border-blue-500 focus:shadow-lg focus:shadow-blue-100 text-white bg-gray-800 placeholder-gray-400"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Type your text here..."
              autoComplete="off"
              spellCheck={false}
            />
          </div>

          <div className="flex items-center justify-center">
            <button
              className="bg-gradient-to-r from-blue-500 to-purple-600 border-none rounded-full w-12 h-12 text-white cursor-pointer transition-all duration-300 flex items-center justify-center text-lg hover:scale-110 hover:shadow-lg hover:shadow-blue-300"
              onClick={swapLanguages}
              title="Swap languages"
            >
              ⇄
            </button>
          </div>

          <div className="flex flex-col">
            <label className="font-semibold text-gray-700 mb-3 text-lg">
              {isIndonesianToUnang ? 'Bahasa Unang' : 'Indonesian'}
            </label>
            <textarea
              className="w-full min-h-[150px] p-4 border-2 border-gray-200 rounded-xl text-base leading-relaxed resize-none bg-gray-50 text-gray-800"
              value={outputText}
              placeholder="Translation will appear here..."
              readOnly
            />
          </div>
        </div>

        <div className="flex flex-wrap gap-4 justify-center mb-8">
          <button
            className="px-6 py-3 border-none rounded-lg text-base font-semibold cursor-pointer transition-all duration-300 uppercase tracking-wide bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:-translate-y-1 hover:shadow-lg hover:shadow-blue-300"
            onClick={translate}
            disabled={isLoading}
          >
            {isLoading ? 'Translating...' : 'Translate'}
          </button>
          <button
            className="px-6 py-3 border-none rounded-lg text-base font-semibold cursor-pointer transition-all duration-300 uppercase tracking-wide bg-gray-100 text-gray-700 border-2 border-gray-200 hover:bg-gray-200 hover:border-gray-300"
            onClick={clear}
          >
            Clear
          </button>
          <button
            className="px-6 py-3 border-none rounded-lg text-base font-semibold cursor-pointer transition-all duration-300 uppercase tracking-wide bg-gray-100 text-gray-700 border-2 border-gray-200 hover:bg-gray-200 hover:border-gray-300"
            onClick={copyResult}
            disabled={!outputText}
          >
            Copy Result
          </button>
        </div>

        <div className="mt-10 pt-8 border-t border-gray-200">
          <h3 className="text-gray-800 mb-4 text-center font-semibold">
            Examples (Click to try)
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {examples.map((example) => (
              <div
                key={example.word}
                className="bg-gray-50 p-4 rounded-lg border-l-4 border-blue-500 cursor-pointer transition-all duration-300 hover:bg-gray-100 hover:-translate-y-1"
                onClick={() => handleExampleClick(example.word)}
              >
                <div className="font-semibold text-gray-800">{example.word}</div>
                <div className="text-gray-600 text-sm mt-1">{example.translation}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BahasaUnangTranslator;