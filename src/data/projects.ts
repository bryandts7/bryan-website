// src/config/projects.ts
import bhinnekaLogo from '../assets/projects/bhinneka.png'
import effsegLogo from '../assets/projects/effseg.png'
import whisperLogo from '../assets/projects/whisper.png'
import text2imgLogo from '../assets/projects/text2img.png'
import mnist from '../assets/projects/mnist.png'
import compGPT from '../assets/projects/compGPT.png'
import cuhkEcom from '../assets/projects/cuhkEcom.png'
import potNet from '../assets/projects/potraitNet.png'
import ptp from '../assets/projects/ptp.png'
// Add a placeholder for translator logo - you can replace with actual image
import translatorLogo from '../assets/translator.png'

export interface Project {
    id: string;
    title: string;
    description: string;
    imageUrl: string;
    technologies: string[];
    githubUrl?: string;
    paperUrl?: string;
    demoUrl?: string;
    content?: string;
    isInteractive?: boolean; // New field to indicate interactive projects
  }
  
  export const projects: Project[] = [
    {
      id: 'bahasa-unang-translator',
      title: 'Bahasa Unang Translator',
      description: 'An interactive web translator for Bahasa Unang, a constructed language based on Indonesian',
      imageUrl: translatorLogo, // Placeholder image
      technologies: ['TypeScript', 'React', 'Tailwind CSS', 'NLP'],
      content: `
      Bahasa Unang: Indonesian Secret Language

Bahasa Unang is a playful encrypted version of Indonesian language commonly used among Indonesian students as a secret code language. Similar to "Pig Latin" in English, it transforms regular Indonesian words using a systematic formula, making conversations incomprehensible to those who don't know the rules.

The Basic Formula

Every Indonesian word follows this transformation pattern:

U(x) = (b)n(c)ng

Where:
- x = Last syllable with all vowels changed to 'a'
- b = Word with the last syllable removed  
- c = Original vowel(s) from the last syllable

Examples

hancur becomes uncar hanung
lari becomes ura laning
siapa becomes upa sianang
gua becomes ua gunang

Special Rules

Rule 1: Consonant Movement
If there's a consonant before the last syllable, it moves with the last syllable.
Example: "sebentar" becomes "untar sebenang" (not "utar sebennang")

Rule 2: Single Syllable Words
For one-syllable words, remove the 'b' component.
Example: "bel" becomes "ubal neng"

Rule 3: Words Ending with "nya"
Handle the suffix specially to maintain meaning.
Example: "sepedanya" becomes "uda sepenangnya"

How It Works

Indonesian words are split into syllables first. The last syllable gets transformed according to the formula, while the remaining syllables form the middle part. For words like "gua" which is pronounced "gu-a", it splits into two syllables and follows the regular pattern.

Cultural Background

Bahasa Unang was created by Indonesian students for private communication in schools. It's still used today in social media, gaming communities, and among friends who want to have conversations that sound mysterious to outsiders. The language represents the playful and creative nature of Indonesian youth culture.

Why Learn It

Learning Bahasa Unang gives you insight into Indonesian culture, provides a fun way to exercise your language skills, and lets you participate in a unique form of communication that strengthens social bonds within Indonesian communities.
      `,
      isInteractive: true,
      demoUrl: '/translator'
    },
    {
      id: 'bhinneka',
      title: 'Bhinneka',
      description: 'A Multilingual LLM for Indonesian Regional Languages',
      imageUrl: bhinnekaLogo,
      technologies: ['Python', 'LoRA', 'SFT', 'HuggingFace'],
      content: `Indonesia is home to over 700 languages, many of which are at risk of marginalization and extinction. 
        Despite this linguistic diversity, there is a notable lack of high-performing LLMs tailored for Indonesia. 
        Additionally, the demand for mobile-compatible LLMs is high for digital applications in Indonesia. 
        To enhance accessibility for the Indonesian community, we created a dataset by translating existing 
        instruction datasets into multiple regional languages and fine-tuned
        an open-source LLM, based on Qwen-2.5 1.5B Instruct, to develop a multilingual
        LLM that supports English, Indonesian, and 8 regional languages. We evaluate
        the resulting model, Bhinneka 1.5B, on both discriminative and generative tasks.
        The results indicate that our model, despite its smaller size, can compete with
        larger models in Indonesia's regional languages. `,
        paperUrl: 'https://drive.google.com/file/d/1ct052hR68AtbWI1vd70oe0qqErb78r9o/view',
        demoUrl: 'https://huggingface.co/richardcsuwandi/bhinneka'
    },
    {
      id: 'effseg',
      title: 'Efficient Semantic Segmentation',
      description: 'Knowledge Distillation utilizing Vision Transformer',
      imageUrl: effsegLogo,
      technologies: ['Python', 'Computer Vision', 'Knowledge Distillation'],
      content: `Accurate scene understanding is crucial for autonomous
        driving safety, with semantic segmentation being a key task.
        Vision Transformers (ViTs) outperform traditional CNNs

        but face challenges in real-time applications due to com-
        putational constraints. SegFormer combines efficient hier-
        archical feature extraction with a lightweight MLP decoder,

        yet its high-performance variant, SegFormer-B5, sacrifices
        speed for accuracy, while the lightweight SegFormer-B0 is
        faster but less accurate.

        This paper proposes a knowledge distillation frame-
        work using SegFormer-B5 as a teacher model to en-
        hance SegFormer-B0, improving segmentation accuracy

        while maintaining high inference speed. Incorporating pre-
        trained weights further boosts training efficiency and adapt-
        ability. Experiments on the Cityscapes and Mapillary Vis-
        tas dataset validate the method's effectiveness, achieving

        a strong balance between performance and efficiency for
        real-time semantic segmentation.`,
      paperUrl: 'https://drive.google.com/file/d/19t2ndm7cFX7UfP49gGHYa-tEq8PbVrL8/view'
    },
    {
        id: 'potnet',
        title: 'PotraitNet Mattinghuman',
        description: 'Reproduce PotraitNet for Large Mattinghuman Dataset in edge devices',
        imageUrl: potNet,
        technologies: ['Python', 'Computer Vision', 'PyTorch'],
        content: `Implemented a modified version of the PortraitNet architecture for real-time
        portrait segmentation, using cross-entropy loss and consistency constraint loss for training. Various data augmentation techniques were applied to enhance performance.
        The model was trained on the EG1800 and Mattinghuman datasets, achieving high accuracy in semantic segmentation tasks. Despite computational constraints, the models demonstrated
        competitive results, particularly in boundary segmentation and overall accuracy, with mIOU reaching 95.31% on the EG1800 test dataset using EG1800 pretrained and 93.83%
        using Mattinghuman pretrained. Furthermore, the face parsing implemented using multi-class classification reach 94.38% overall mIOU metrics over all classes`,
        githubUrl: 'https://github.com/bryandts7/PotraitNet-Mattinghuman'
      },
    {
      id: 'whisper',
      title: 'Indian English Whisper',
      description: 'Fine-Tuning OpenAI Whisper for Enhanced Recognition of Indian-Accented English in ASR',
      imageUrl: whisperLogo,
      technologies: ['Python', 'ASR', 'HuggingFace'],
      content: `Automatic Speech Recognition (ASR) systems are integral to modern applications,
        yet they often struggle with diverse accents, particularly Indian-accented English,
        which is shaped by unique phonetics, rhythms, and intonations. This project
        addresses this challenge by fine-tuning OpenAI's Whisper model, a state-of-the-
        art ASR system pre-trained on multilingual datasets, using the Svarah dataset—a
        curated collection of Indian-accented English audio. The goal was to adapt Whisper
        for improved transcription accuracy in this domain, evaluated through the Word
        Error Rate (WER) metric. Fine-tuning involved preprocessing the dataset to
        ensure compatibility with the model's input requirements, followed by targeted
        training using advanced techniques such as gradient accumulation. The base
        model (whisper-base) achieved an initial WER of 33.25%, which was reduced
        to 16.31% after fine-tuning—a relative improvement of approximately 51%. This
        significant enhancement highlights the effectiveness of fine-tuning in adapting ASR
        models to specific accents. The project not only demonstrated the feasibility of
        improving ASR systems for Indian English but also revealed specific error patterns
        and limitations, such as challenges with noisy or heavily accented speech.`,
      paperUrl: 'https://drive.google.com/file/d/12RfIH9noWZHnJs6gl8VtyK0rvORISVe9/view',
      demoUrl: 'https://huggingface.co/spaces/bryandts/whisper-english-india-accent'
    },

    {
        id: 'complianceGPT',
        title: 'Compliance GPT',
        description: 'AI-as-a-service (AIaas) solution that answers banking compliance question within 30 seconds up to 85% accuracy',
        imageUrl: compGPT,
        technologies: ['Python', 'Langchain', 'OpenAI API', 'VectorDB', 'FastAPI', 'React'],
        content: `The compliance review between business and compliance is time-consuming; optimizing it could unlock significant business opportunities; however, the compliance team faces hurdles in efficiently managing 10k+ regulatory documents, potential for human-risk and inefficiencies. Compliance GPT offers an AI-as-a-service (AIaas) solution that answers banking compliance question within 30 seconds up to 85% accuracy. It addresses key gaps by saving 83% time and 97% usage cost for compliance review, while being available 24/7 as a standardized knowledge. Compliance GPT does not replace compliance teams; it revolutionizes them, helping businesses capture opportunities more efficiently
`,
        demoUrl: 'https://www.youtube.com/watch?v=PjGoE4-sRTs'
      },

    {
        id: 'text2img',
        title: 'CUHK(SZ) Text2Image',
        description: 'Text-Based Image Generation CUHK Shenzhen Building',
        imageUrl: text2imgLogo,
        technologies: ['Python', 'PyTorch'],
        content: `Completed an Advanced Machine Learning project leveraging Deep Convolutional Generative Adversarial Networks (DC-GANs) to generate realistic images from textual descriptions. Enhanced the GAN framework by introducing a third discriminator input for improved image-text matching and realism. The project focused on creating a dataset of 144 annotated campus building images, supporting high-quality text-to-image synthesis to help new and exchange students familiarize themselves with campus architecture. This innovative approach contributes to research on personalized and contextualized image generation with broader applications beyond academic settings.`,
        paperUrl: 'https://drive.google.com/file/d/1RX0MvltXt-1qxPJiw4pMfXQV9UTs2-25/view',
        demoUrl: 'https://huggingface.co/spaces/bryandts/cuhksz-text2image'
      },

      {
        id: 'ptp',
        title: 'Party Together Problem',
        description: 'Finding pick-up locations that optimizes the transportation plan for the Party Together problem, which is an NP-Hard problem.',
        imageUrl: ptp,
        technologies: ['Travelling Salesman Problem', 'Heuristic'],
        content: ``,
        githubUrl: 'https://github.com/bryandts7/party-together',
        paperUrl: 'https://github.com/bryandts7/party-together/blob/main/CSC4120_Project_Report__Copy_.pdf'
      },

      {
        id: 'cuhk_ecom',
        title: 'CUHK(SZ) E-commerce',
        description: 'E-commerce platform tailored to the CUHK Shenzhen community',
        imageUrl: cuhkEcom,
        technologies: ['Flask', 'SQLite', 'Bootstrap', 'Javascript'],
        content: `This project implements a neural network model to recognize handwritten digits (0-9) using the MNIST dataset. The project is written in C++ and utilizes OpenCV for data processing and model training.`,
        githubUrl: 'https://github.com/bryandts7/ecom_cuhksz_new',
        demoUrl: 'https://www.youtube.com/watch?v=IXFE7oJ1tCg'
      },
      {
        id: 'mnist',
        title: 'MNIST CPP',
        description: 'Handwritten Digit Recognition using Neural Networks',
        imageUrl: mnist,
        technologies: ['C++', 'OpenCV'],
        content: `This project implements a neural network model to recognize handwritten digits (0-9) using the MNIST dataset. The project is written in C++ and utilizes OpenCV for data processing and model training.`,
        githubUrl: 'https://github.com/bryandts7/mnist-cpp'
      },
    // Add more projects
  ];