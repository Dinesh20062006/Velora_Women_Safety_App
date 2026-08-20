import json

paths = [
    "d:/chatbot/src/data/velora_chatbot_knowledge.json",
    "d:/chatbot/velora_chatbot_knowledge.json"
]

time_greetings = [
    {
        "category": "general_convo",
        "question": "Good morning",
        "answer": "Good morning! ☀️ Wishing you a peaceful, empowering, and safe day ahead. Remember, Velora is always here to look out for you. How can I assist you today?",
        "keywords": ["good morning", "morning", "greeting", "day"],
        "intent": "greeting"
    },
    {
        "category": "general_convo",
        "question": "Good morning Velora",
        "answer": "Good morning! ☀️ Warm greetings to you! I hope your day starts with energy and positivity. How can I help you stay safe and informed today?",
        "keywords": ["good morning", "morning", "velora"],
        "intent": "greeting"
    },
    {
        "category": "general_convo",
        "question": "Good afternoon",
        "answer": "Good afternoon! 🌼 Hope your day is going smoothly and safely. How can Velora assist you right now?",
        "keywords": ["good afternoon", "afternoon", "day"],
        "intent": "greeting"
    },
    {
        "category": "general_convo",
        "question": "Good afternoon Velora",
        "answer": "Good afternoon! 🌸 Hope you're having a productive and safe day. I am right here if you need any safety guidance, risk updates, or assistance.",
        "keywords": ["good afternoon", "afternoon", "velora"],
        "intent": "greeting"
    },
    {
        "category": "general_convo",
        "question": "Good evening",
        "answer": "Good evening! 🌙 I hope you are having a calm and pleasant evening. Whatever safety questions, route advice, or support you need, I am right here to help.",
        "keywords": ["good evening", "evening", "night"],
        "intent": "greeting"
    },
    {
        "category": "general_convo",
        "question": "Good evening Velora",
        "answer": "Good evening! 🌙 As the day winds down, please stay safe if traveling late. Velora is always active to guide you with safe routes and risk information. How can I help you tonight?",
        "keywords": ["good evening", "evening", "velora"],
        "intent": "greeting"
    },
    {
        "category": "general_convo",
        "question": "Good night",
        "answer": "Good night! 😴✨ Rest well and stay safe. Remember to ensure your doors are locked, keep your emergency contacts ready, and know that Velora is active 24/7 whenever you need us. Have sweet dreams!",
        "keywords": ["good night", "night", "sleep", "sweet dreams"],
        "intent": "greeting"
    },
    {
        "category": "general_convo",
        "question": "Good night Velora",
        "answer": "Good night! 🌙✨ Wishing you a peaceful and restful night. Take care, sleep well, and know Velora is standing by 24/7 if you ever need safety assistance.",
        "keywords": ["good night", "night", "sweet dreams", "velora"],
        "intent": "greeting"
    },
    {
        "category": "general_convo",
        "question": "Sweet dreams",
        "answer": "Sweet dreams to you! 🌌✨ Have a peaceful, restful night. Velora is always here whenever you need safety support.",
        "keywords": ["sweet dreams", "good night", "sleep"],
        "intent": "greeting"
    },
    {
        "category": "general_convo",
        "question": "Have a good day",
        "answer": "Thank you so much! 🌸 Wishing you a wonderful, safe, and fulfilling day ahead. Take care and feel free to reach out anytime!",
        "keywords": ["have a good day", "have a nice day", "good day"],
        "intent": "greeting"
    },
    {
        "category": "general_convo",
        "question": "Have a nice day",
        "answer": "Thank you! ☀️ You have a lovely and safe day as well! Stay aware, trust your instincts, and know Velora is here for you.",
        "keywords": ["nice day", "good day", "take care"],
        "intent": "greeting"
    },
    {
        "category": "general_convo",
        "question": "How are you?",
        "answer": "I am doing great, thank you for asking! 💜 I am always ready to help you with safety advice, incident reporting, emergency guidance, or location risk scores. How are you doing today?",
        "keywords": ["how are you", "how are you doing", "hows it going"],
        "intent": "greeting"
    },
    {
        "category": "general_convo",
        "question": "Nice to meet you",
        "answer": "Nice to meet you too! 💜 Welcome to Velora. I am your dedicated AI safety assistant. Feel free to ask me anything about safety tips or using the app.",
        "keywords": ["nice to meet you", "pleased to meet you", "welcome"],
        "intent": "greeting"
    },
    {
        "category": "general_convo",
        "question": "Stay safe",
        "answer": "Thank you! 💜 You stay safe too. Remember to trust your instincts, stay aware of your surroundings, and keep Velora close by!",
        "keywords": ["stay safe", "take care", "safety"],
        "intent": "greeting"
    },
    {
        "category": "general_convo",
        "question": "Happy weekend",
        "answer": "Happy weekend to you too! 🎉 Enjoy your time off, relax, and stay safe wherever you travel. Velora is always here 24/7 if you need any safety advice!",
        "keywords": ["happy weekend", "weekend", "enjoy weekend"],
        "intent": "greeting"
    }
]

for p in paths:
    with open(p, "r", encoding="utf-8") as f:
        data = json.load(f)
    
    # Map questions by lower case to avoid duplicates
    existing_map = {item["question"].strip().lower(): i for i, item in enumerate(data) if "question" in item}
    
    for tg in time_greetings:
        q_key = tg["question"].strip().lower()
        if q_key in existing_map:
            # Overwrite existing item with enriched item
            data[existing_map[q_key]] = tg
        else:
            data.append(tg)
            existing_map[q_key] = len(data) - 1

    with open(p, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=2, ensure_ascii=False)

    print(f"Updated {p} with time-of-day greetings! Total items: {len(data)}")

# Rebuild velora_intents.json
with open("d:/chatbot/src/data/velora_chatbot_knowledge.json", "r", encoding="utf-8") as f:
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

intent_paths = [
    "d:/chatbot/src/data/velora_intents.json",
    "d:/chatbot/velora_intents.json"
]

for p in intent_paths:
    with open(p, "w", encoding="utf-8") as f:
        json.dump(intents_output, f, indent=2, ensure_ascii=False)

print("SUCCESS: Synced time greetings and intents files.")
