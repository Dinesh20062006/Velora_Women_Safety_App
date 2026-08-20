import json
import re

# 1. Prepare JSON knowledge dataset additions & updates
dataset_path = "d:/chatbot/src/data/velora_chatbot_knowledge.json"
dataset_path_root = "d:/chatbot/velora_chatbot_knowledge.json"

greetings_data = [
    # GENERAL GREETINGS
    {
        "category": "greeting",
        "question": "hi",
        "answer": "Hi dear user! 💜 I'm Velora's AI assistant. How can I help you today?",
        "keywords": ["hi", "hii", "hiii", "hiiii", "greeting"],
        "intent": "greeting"
    },
    {
        "category": "greeting",
        "question": "hello",
        "answer": "Hello! 🌷 It's lovely to have you here. What can I assist you with?",
        "keywords": ["hello", "helloo", "hellooo", "greeting"],
        "intent": "greeting"
    },
    {
        "category": "greeting",
        "question": "hey",
        "answer": "Hey there! 💜 Welcome to Velora. How can I support you today?",
        "keywords": ["hey", "heyy", "heyyy", "greeting"],
        "intent": "greeting"
    },
    {
        "category": "greeting",
        "question": "hey there",
        "answer": "Hi! 😊 I'm here and ready to help. What would you like to know?",
        "keywords": ["hey there", "hello there", "hi there"],
        "intent": "greeting"
    },
    {
        "category": "greeting",
        "question": "hi assistant",
        "answer": "Hello dear user! 🌸 Feel free to ask me anything about Velora or safety.",
        "keywords": ["hi assistant", "hello assistant", "hey assistant"],
        "intent": "greeting"
    },

    # MORNING GREETING
    {
        "category": "greeting",
        "question": "good morning",
        "answer": "Good morning, dear user! ☀️ I hope you're having a safe and peaceful day. How can I help you?",
        "keywords": ["good morning", "goodmorning", "morning", "gm", "good morn"],
        "intent": "morning_greeting"
    },
    {
        "category": "greeting",
        "question": "gm",
        "answer": "Good morning! 🌷 Wishing you a safe and wonderful day ahead. What can I assist you with?",
        "keywords": ["gm", "good morning", "morning"],
        "intent": "morning_greeting"
    },
    {
        "category": "greeting",
        "question": "good morninggg",
        "answer": "Good morning, dear user! 💜 It's lovely to have you here. How may I support you today?",
        "keywords": ["good morninggg", "gooood morning", "morning"],
        "intent": "morning_greeting"
    },

    # AFTERNOON GREETING
    {
        "category": "greeting",
        "question": "good afternoon",
        "answer": "Good afternoon, dear user! 🌷 I hope your day is going well. How can I assist you?",
        "keywords": ["good afternoon", "goodafternoon", "afternoon"],
        "intent": "afternoon_greeting"
    },
    {
        "category": "greeting",
        "question": "afternoon",
        "answer": "Good afternoon! 💜 I'm here and ready to help. What would you like to know?",
        "keywords": ["afternoon", "good afternoon"],
        "intent": "afternoon_greeting"
    },

    # EVENING GREETING
    {
        "category": "greeting",
        "question": "good evening",
        "answer": "Good evening, dear user! 🌆 I hope you've had a good day. How can I assist you?",
        "keywords": ["good evening", "goodevening", "evening"],
        "intent": "evening_greeting"
    },
    {
        "category": "greeting",
        "question": "evening",
        "answer": "Good evening! 💜 I'm here whenever you need safety guidance or assistance.",
        "keywords": ["evening", "good evening"],
        "intent": "evening_greeting"
    },

    # NIGHT GREETING
    {
        "category": "greeting",
        "question": "good night",
        "answer": "Good night, dear user! 🌙 Stay safe and take good care of yourself.",
        "keywords": ["good night", "goodnight", "goodnite", "night"],
        "intent": "night_greeting"
    },
    {
        "category": "greeting",
        "question": "goodnight",
        "answer": "Goodnight, dear user! 🌷 Rest well and stay safe.",
        "keywords": ["goodnight", "good night", "night"],
        "intent": "night_greeting"
    },

    # INFORMAL GREETING
    {
        "category": "greeting",
        "question": "yo",
        "answer": "Hey! 😊 I'm here and ready to help. What's on your mind?",
        "keywords": ["yo", "yo bro", "sup", "whats up", "what's up", "howdy"],
        "intent": "informal_greeting"
    },
    {
        "category": "greeting",
        "question": "what's up",
        "answer": "What's up! 💜 I'm here to help with your questions. What can I do for you?",
        "keywords": ["whats up", "what's up", "sup"],
        "intent": "informal_greeting"
    },

    # HOW ARE YOU
    {
        "category": "greeting",
        "question": "how are you",
        "answer": "I'm doing great, thank you for asking! 😊 How can I help you today?",
        "keywords": ["how are you", "how are you doing", "how r u", "how are u"],
        "intent": "how_are_you"
    },

    # ARE YOU THERE
    {
        "category": "greeting",
        "question": "are you there",
        "answer": "Yes, I'm here! 😊 Tell me what you need help with.",
        "keywords": ["are you there", "anyone there", "is anyone there", "can you hear me"],
        "intent": "are_you_there"
    },

    # GENERAL HELP REQUEST
    {
        "category": "greeting",
        "question": "help",
        "answer": "Of course, dear user! 💜 Tell me what you need help with, and I'll do my best to assist you.",
        "keywords": ["help", "i need help", "help me", "can you help me", "i need assistance"],
        "intent": "help_request"
    },

    # THANK YOU
    {
        "category": "greeting",
        "question": "thank you",
        "answer": "You're very welcome, dear user! 💜 I'm glad I could help.",
        "keywords": ["thanks", "thank you", "thank u", "thx", "thanks a lot", "thank you so much"],
        "intent": "thank_you"
    },

    # GOODBYE
    {
        "category": "greeting",
        "question": "goodbye",
        "answer": "Goodbye, dear user! 💜 Stay safe and take care.",
        "keywords": ["bye", "bye bye", "goodbye", "see you", "see ya", "talk to you later", "i have to go"],
        "intent": "goodbye"
    },

    # CULTURAL GREETINGS
    {
        "category": "greeting",
        "question": "namaste",
        "answer": "Namaste! 🙏 Welcome to Velora. What can I assist you with today?",
        "keywords": ["namaste", "namaskar", "vanakkam", "வணக்கம்", "நமஸ்தே"],
        "intent": "cultural_greeting"
    },
    {
        "category": "greeting",
        "question": "vanakkam",
        "answer": "Vanakkam! 🙏 Welcome to Velora. How can I assist you today?",
        "keywords": ["vanakkam", "namaste", "வணக்கம்"],
        "intent": "cultural_greeting"
    }
]

# Update JSON files
for p in [dataset_path, dataset_path_root]:
    with open(p, "r", encoding="utf-8") as f:
        data = json.load(f)

    # Index by lower question
    existing_map = {item["question"].strip().lower(): i for i, item in enumerate(data) if "question" in item}

    for item in greetings_data:
        q_key = item["question"].strip().lower()
        if q_key in existing_map:
            data[existing_map[q_key]] = item
        else:
            data.append(item)
            existing_map[q_key] = len(data) - 1

    with open(p, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=2, ensure_ascii=False)

    print(f"Updated {p}. Total items: {len(data)}")

# Rebuild velora_intents.json
with open(dataset_path, "r", encoding="utf-8") as f:
    full_data = json.load(f)

intents_dict = {}
for item in full_data:
    intent_name = item.get("intent", "general_information")
    category_name = item.get("category", "general")
    keywords = item.get("keywords", [])
    question = item.get("question", "")

    if intent_name not in intents_dict:
        intents_dict[intent_name] = {
            "category": category_name,
            "examples": [],
            "keywords": set()
        }
    intents_dict[intent_name]["examples"].append(question)
    for kw in keywords:
        intents_dict[intent_name]["keywords"].add(kw)

intents_output = {
    "platform": "Velora AI Women Safety Platform",
    "total_intents": len(intents_dict),
    "intents": [
        {
            "intent": name,
            "category": data["category"],
            "keywords": sorted(list(data["keywords"])),
            "example_phrases": data["examples"]
        }
        for name, data in intents_dict.items()
    ]
}

for p in ["d:/chatbot/src/data/velora_intents.json", "d:/chatbot/velora_intents.json"]:
    with open(p, "w", encoding="utf-8") as f:
        json.dump(intents_output, f, indent=2, ensure_ascii=False)

print("Rebuilt velora_intents.json!")
