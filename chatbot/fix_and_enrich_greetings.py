import json
import re

file_path = "d:/chatbot/src/data/velora_chatbot_knowledge.json"

with open(file_path, "r", encoding="utf-8") as f:
    raw_content = f.read()

# Fix syntax errors where user inserted '[' inside array
# Replace any pattern like "},\n\n  [\n  {" or "}\n]\n]" with normal comma separation
fixed_content = re.sub(r'\}\s*,\s*\[\s*\{', '},\n  {', raw_content)
fixed_content = re.sub(r'\}\s*\]\s*\]', '}\n]', fixed_content)

try:
    data = json.loads(fixed_content)
    print(f"Successfully parsed {len(data)} items!")
except Exception as e:
    print(f"JSON Parse error after regex fix: {e}")
    # Fallback parser using regex to extract all objects {...}
    raw_objects = re.findall(r'\{[^{}]*\}', raw_content, re.DOTALL)
    data = []
    for obj_str in raw_objects:
        try:
            obj = json.loads(obj_str)
            data.append(obj)
        except Exception:
            pass
    print(f"Regex extracted {len(data)} valid objects.")

# Warm greetings dictionary map or replacement
warm_greetings = [
    {
        "category": "general_convo",
        "question": "Hello",
        "answer": "Hello! 💜 Welcome to Velora. I am your dedicated AI Safety Assistant. Please know that your safety, comfort, and peace of mind are our highest priorities. How can I support or guide you today?",
        "keywords": ["hello", "hi", "greetings", "welcome"],
        "intent": "greeting"
    },
    {
        "category": "general_convo",
        "question": "Hi",
        "answer": "Hi there! 🌸 Warm greetings from Velora! Whether you need safety advice, help reporting an incident, or quick access to emergency tools, I am right here by your side. How may I assist you today?",
        "keywords": ["hi", "hey", "hello"],
        "intent": "greeting"
    },
    {
        "category": "general_convo",
        "question": "Hey",
        "answer": "Hey there! 🌟 Sending you warm thoughts and a gentle reminder that you are never alone. Velora is here 24/7 to guide you, protect your privacy, and keep you informed. How can I help today?",
        "keywords": ["hey", "hello", "greetings"],
        "intent": "greeting"
    },
    {
        "category": "general_convo",
        "question": "Good morning",
        "answer": "Good morning! ☀️ Wishing you a peaceful, empowering, and safe day ahead. Remember, Velora is always here to look out for you. How can I assist you today?",
        "keywords": ["good morning", "morning", "greeting"],
        "intent": "greeting"
    },
    {
        "category": "general_convo",
        "question": "Good evening",
        "answer": "Good evening! 🌙 I hope you are having a calm and safe evening. Whatever safety questions, route advice, or support you need, I am here to help.",
        "keywords": ["good evening", "evening", "night"],
        "intent": "greeting"
    },
    {
        "category": "general_convo",
        "question": "Good afternoon",
        "answer": "Good afternoon! 🌼 Hope your day is going smoothly and safely. How can Velora assist you right now?",
        "keywords": ["good afternoon", "afternoon"],
        "intent": "greeting"
    },
    {
        "category": "general_convo",
        "question": "Thank you",
        "answer": "You are so very welcome! 💜 Your safety and well-being mean everything to us. Stay safe, trust your instincts, and know that I am always right here whenever you need me.",
        "keywords": ["thank you", "thanks", "thankful", "grateful"],
        "intent": "greeting"
    },
    {
        "category": "general_convo",
        "question": "Thanks a lot",
        "answer": "It is truly my pleasure! 🌸 Take good care of yourself and stay safe. Feel free to reach out anytime!",
        "keywords": ["thanks", "thankful", "appreciation"],
        "intent": "greeting"
    },
    {
        "category": "general_convo",
        "question": "Hello, who are you and what can you do?",
        "answer": "Hello and welcome! 💜 I am your Velora AI Safety Assistant. I am here to offer warm guidance, explain platform features, guide you through SOS and incident-reporting workflows, analyze risk zones and safe routes, and provide practical safety advice. In an immediate emergency, please prioritize your physical safety and use local emergency services (112/911). How can I help you today?",
        "keywords": ["hello", "who", "assistant", "help", "velora", "warm"],
        "intent": "greeting"
    },
    {
        "category": "general_convo",
        "question": "I feel anxious / scared",
        "answer": "Take a deep, slow breath 💜 You are not alone. Please move to a well-lit, populated place or contact a trusted friend if you are out. If you are in immediate physical danger, press the Velora SOS button or call emergency services (112/911) right away. I am right here with you—tell me how I can best support you.",
        "keywords": ["anxious", "scared", "fear", "nervous", "alone", "help"],
        "intent": "emergency"
    }
]

# De-duplicate existing dataset items by question key
seen_questions = set()
cleaned_data = []

# First put warm greetings
for wg in warm_greetings:
    q_key = wg["question"].strip().lower()
    seen_questions.add(q_key)
    cleaned_data.append(wg)

# Then process existing items
for item in data:
    if isinstance(item, dict) and "question" in item and "answer" in item:
        q_key = item["question"].strip().lower()
        # If it's an existing greeting question, update it to be warm
        if item.get("intent") == "greeting" or item.get("category") == "general_convo":
            if q_key not in seen_questions:
                # Add a warm tone if not already replaced
                item["answer"] = "Hello! 💜 Warm welcome to Velora. " + item["answer"]
                seen_questions.add(q_key)
                cleaned_data.append(item)
        else:
            if q_key not in seen_questions:
                seen_questions.add(q_key)
                cleaned_data.append(item)

# Save to both paths
paths = [
    "d:/chatbot/src/data/velora_chatbot_knowledge.json",
    "d:/chatbot/velora_chatbot_knowledge.json"
]

for p in paths:
    with open(p, "w", encoding="utf-8") as f:
        json.dump(cleaned_data, f, indent=2, ensure_ascii=False)

# Rebuild velora_intents.json
intents_dict = {}
for item in cleaned_data:
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

print(f"SUCCESS: Cleaned dataset syntax. Total items: {len(cleaned_data)} across {len(intents_dict)} intents.")
