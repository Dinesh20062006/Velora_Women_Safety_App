import json
import os

knowledge_dataset = [
    # 1. GENERAL VELORA QUESTIONS (15 items)
    {
        "category": "general",
        "question": "What is Velora?",
        "answer": "Velora is an AI-powered digital women safety platform designed to help users report safety incidents, access emergency assistance, receive safety risk information, interact with an AI assistant, and connect with relevant authorities.",
        "keywords": ["velora", "platform", "about", "what is"],
        "intent": "about_velora"
    },
    {
        "category": "general",
        "question": "What does Velora do?",
        "answer": "Velora empowers women safety by providing incident reporting tools, AI-based crime risk analysis, emergency contact alerts, safety guidance, and a central platform connecting citizens with safety management systems.",
        "keywords": ["velora", "purpose", "features", "do"],
        "intent": "about_velora"
    },
    {
        "category": "general",
        "question": "How does Velora help women?",
        "answer": "Velora helps women by offering immediate safety advice, streamlined incident reporting, location risk insights, emergency guidance, and an AI assistant for 24/7 safety support.",
        "keywords": ["help", "women", "safety", "benefits"],
        "intent": "about_velora"
    },
    {
        "category": "general",
        "question": "Why was Velora created?",
        "answer": "Velora was created to leverage modern AI technology and data-driven insights to enhance women's safety, streamline incident reporting, and facilitate efficient communication with authorities.",
        "keywords": ["created", "mission", "purpose", "why"],
        "intent": "about_velora"
    },
    {
        "category": "general",
        "question": "What are the main features of Velora?",
        "answer": "Velora's main features include AI Chatbot assistance, Incident/Complaint Reporting, Risk Area Mapping & Safety Scores, Emergency Guidance, and Notification/Status Tracking.",
        "keywords": ["features", "main", "capabilities", "tools"],
        "intent": "general_information"
    },
    {
        "category": "general",
        "question": "How does Velora improve safety?",
        "answer": "Velora improves safety by providing real-time risk awareness, actionable precautions, anonymous/direct incident filing, and easy access to emergency information when users feel vulnerable.",
        "keywords": ["improve", "safety", "awareness", "protection"],
        "intent": "general_information"
    },
    {
        "category": "general",
        "question": "Who can use Velora?",
        "answer": "Velora is primarily designed for women seeking safety tools and guidance, but anyone looking for safety information, risk mapping, or incident reporting support can use the platform.",
        "keywords": ["who", "users", "target", "anyone"],
        "intent": "general_information"
    },
    {
        "category": "general",
        "question": "Is Velora an emergency safety platform?",
        "answer": "Yes, Velora is a women safety platform that offers emergency guidance and reporting features. However, for active life-threatening emergencies, users should directly dial local emergency numbers (like 112 or 911).",
        "keywords": ["emergency", "platform", "safety", "urgent"],
        "intent": "general_information"
    },
    {
        "category": "general",
        "question": "How does the Velora system work?",
        "answer": "Velora works by integrating user-reported incidents, historical safety data, AI risk modeling, and an intelligent chatbot interface to deliver real-time safety insights and support.",
        "keywords": ["system", "works", "architecture", "how"],
        "intent": "general_information"
    },
    {
        "category": "general",
        "question": "What services does Velora provide?",
        "answer": "Velora provides incident reporting, risk map visualizers, safety advisory chatbot services, notification alerts, and complaint tracking workflows.",
        "keywords": ["services", "offerings", "provide"],
        "intent": "general_information"
    },
    {
        "category": "general",
        "question": "Is Velora free to use?",
        "answer": "Yes, Velora is designed to be accessible to all users as a public safety initiative for women empowerment and security.",
        "keywords": ["free", "cost", "pricing", "charge"],
        "intent": "general_information"
    },
    {
        "category": "general",
        "question": "Is Velora available 24/7?",
        "answer": "Yes, the Velora platform and its AI chatbot are available 24/7 to provide information, safety advice, and incident reporting tools whenever needed.",
        "keywords": ["24/7", "available", "timing", "hours"],
        "intent": "general_information"
    },
    {
        "category": "general",
        "question": "What devices support Velora?",
        "answer": "Velora is accessible via web browsers on desktop, tablet, and mobile devices with internet connectivity.",
        "keywords": ["devices", "mobile", "web", "support"],
        "intent": "general_information"
    },
    {
        "category": "general",
        "question": "How does Velora differ from standard emergency apps?",
        "answer": "Velora combines proactive AI risk estimation, comprehensive incident reporting, community safety mapping, and interactive AI assistance in a single unified platform.",
        "keywords": ["difference", "unique", "compare", "apps"],
        "intent": "general_information"
    },
    {
        "category": "general",
        "question": "Who manages Velora?",
        "answer": "Velora is managed by a dedicated team of safety tech developers, data engineers, and safety domain experts committed to women's security.",
        "keywords": ["manages", "team", "organization", "behind"],
        "intent": "general_information"
    },

    # 2. USER ACCOUNT QUESTIONS (16 items)
    {
        "category": "account",
        "question": "How do I create a Velora account?",
        "answer": "To create an account, click the 'Register' or 'Sign Up' button on the Velora homepage, fill in your required details (such as name, email, and phone number), and set a secure password.",
        "keywords": ["create", "register", "sign up", "account"],
        "intent": "registration"
    },
    {
        "category": "account",
        "question": "how to register on velora",
        "answer": "Navigate to the registration page, enter your personal details and contact info, create a strong password, and submit the form to set up your account.",
        "keywords": ["register", "signup", "new user"],
        "intent": "registration"
    },
    {
        "category": "account",
        "question": "How do I log in?",
        "answer": "Click on 'Log In', enter your registered email or phone number along with your password, and click the 'Submit' button to access your account.",
        "keywords": ["log in", "login", "sign in", "access"],
        "intent": "login"
    },
    {
        "category": "account",
        "question": "i want to sign in",
        "answer": "Go to the Velora login page, input your credentials (email/phone and password), and press 'Log In' to access your account.",
        "keywords": ["sign in", "login", "credentials"],
        "intent": "login"
    },
    {
        "category": "account",
        "question": "How do I log out of my account?",
        "answer": "Click on your profile avatar or account menu at the top right of the screen and select 'Log Out' to safely sign out of your session.",
        "keywords": ["log out", "logout", "sign out"],
        "intent": "logout"
    },
    {
        "category": "account",
        "question": "I forgot my password. What should I do?",
        "answer": "Click 'Forgot Password?' on the login screen, enter your registered email or phone number, and follow the instructions sent to reset your password.",
        "keywords": ["forgot password", "reset password", "password help"],
        "intent": "password"
    },
    {
        "category": "account",
        "question": "how to reset my password?",
        "answer": "Use the 'Forgot Password' link on the login page. Enter your email or phone number to receive a verification code or reset link.",
        "keywords": ["reset", "password", "forgot"],
        "intent": "password"
    },
    {
        "category": "account",
        "question": "Can I change my registered phone number?",
        "answer": "Yes. Go to your Profile settings, locate the Phone Number field, select 'Edit', enter your new phone number, and save changes.",
        "keywords": ["change phone", "update phone", "mobile number"],
        "intent": "profile"
    },
    {
        "category": "account",
        "question": "How do I update my profile?",
        "answer": "Navigate to the 'Profile' section in Velora, update your personal information or profile preferences, and click 'Save Changes'.",
        "keywords": ["update profile", "edit profile", "account info"],
        "intent": "profile"
    },
    {
        "category": "account",
        "question": "Can I change my registered email address?",
        "answer": "Yes, you can update your email address in the Profile settings section after verifying your existing account credentials.",
        "keywords": ["email", "change email", "update email"],
        "intent": "profile"
    },
    {
        "category": "account",
        "question": "Is my account secured?",
        "answer": "Velora uses standard data encryption and secure authentication protocols to protect your personal account information and credentials.",
        "keywords": ["security", "account safety", "protection", "secured"],
        "intent": "security"
    },
    {
        "category": "account",
        "question": "Can I delete my Velora account?",
        "answer": "Yes, account deletion options are available under Account Settings -> Security & Privacy -> Delete Account.",
        "keywords": ["delete account", "remove account", "close account"],
        "intent": "profile"
    },
    {
        "category": "account",
        "question": "Why am I locked out of my account?",
        "answer": "Accounts may be temporarily locked after multiple invalid password attempts. Please wait a few minutes or use 'Forgot Password' to regain access.",
        "keywords": ["locked out", "cannot login", "invalid attempt"],
        "intent": "login"
    },
    {
        "category": "account",
        "question": "Can I use Velora without registering?",
        "answer": "You can view general safety information and use basic chatbot features, but incident reporting and personal alerts require an account.",
        "keywords": ["without account", "guest", "anonymous use"],
        "intent": "registration"
    },
    {
        "category": "account",
        "question": "How do I update my emergency contacts in my profile?",
        "answer": "Go to Profile -> Emergency Contacts, add or update the names and phone numbers of your trusted contacts, and click Save.",
        "keywords": ["emergency contacts", "trusted numbers", "profile contacts"],
        "intent": "profile"
    },
    {
        "category": "account",
        "question": "What information is stored in my profile?",
        "answer": "Your profile stores basic contact details, account credentials, emergency contacts, and your submitted incident records securely.",
        "keywords": ["profile info", "data stored", "my account"],
        "intent": "profile"
    },

    # 3. INCIDENT / COMPLAINT REPORTING (25 items)
    {
        "category": "complaint",
        "question": "How do I report an incident?",
        "answer": "You can report an incident through the 'Report Incident' or 'Complaints' section in Velora. Fill in the incident details, date, location, and submit the form.",
        "keywords": ["report", "incident", "complaint", "file"],
        "intent": "report_incident"
    },
    {
        "category": "complaint",
        "question": "how can i report",
        "answer": "Go to the Report section in Velora, enter details about what happened, select the incident location, and submit your report accurately.",
        "keywords": ["how to report", "file report", "complaint"],
        "intent": "report_incident"
    },
    {
        "category": "complaint",
        "question": "I want to file a complaint.",
        "answer": "Navigate to the Complaints section in Velora, complete the complaint form with necessary details, and click Submit to record your report.",
        "keywords": ["file complaint", "submit complaint", "report issue"],
        "intent": "file_complaint"
    },
    {
        "category": "complaint",
        "question": "Can I report harassment?",
        "answer": "Yes, you can report physical, verbal, or online harassment through the incident reporting portal on Velora.",
        "keywords": ["harassment", "report harassment", "verbal abuse"],
        "intent": "harassment"
    },
    {
        "category": "complaint",
        "question": "someone harassed me how can i report it",
        "answer": "Please use the 'Report Incident' feature on Velora to document the harassment. If you are in immediate danger, prioritize your physical safety and call emergency services first.",
        "keywords": ["harassed", "report harassment", "incident"],
        "intent": "harassment"
    },
    {
        "category": "complaint",
        "question": "Can I report stalking?",
        "answer": "Yes, stalking can be reported under the incident reporting form. Provide as much detail regarding time, locations, and patterns as possible.",
        "keywords": ["stalking", "report stalking", "follower"],
        "intent": "stalking"
    },
    {
        "category": "complaint",
        "question": "Can I report an unsafe location?",
        "answer": "Yes! Velora allows you to flag poorly lit areas, isolated spots, or places where you felt unsafe to alert the community and update risk maps.",
        "keywords": ["unsafe location", "flag location", "dark street", "report area"],
        "intent": "unsafe_location"
    },
    {
        "category": "complaint",
        "question": "What information should I provide in a report?",
        "answer": "Include the date, time, precise location, a description of the incident, and any evidence (photos/audio/documents) if available.",
        "keywords": ["information", "report details", "what to include"],
        "intent": "report_incident"
    },
    {
        "category": "complaint",
        "question": "Can I attach evidence to my complaint?",
        "answer": "Yes, you can upload supporting photos, screenshots, or documents when filing your complaint in Velora.",
        "keywords": ["evidence", "attach photo", "upload screenshot", "proof"],
        "intent": "complaint_evidence"
    },
    {
        "category": "complaint",
        "question": "Can I check my complaint status?",
        "answer": "Yes, navigate to 'My Complaints' or 'Track Status' in your account to view real-time status updates on your report.",
        "keywords": ["complaint status", "track complaint", "check status"],
        "intent": "complaint_status"
    },
    {
        "category": "complaint",
        "question": "Can I edit my complaint after submitting?",
        "answer": "Depending on the processing state of the report, you can add additional information or updates through the 'My Complaints' details page.",
        "keywords": ["edit complaint", "update report", "modify details"],
        "intent": "complaint_update"
    },
    {
        "category": "complaint",
        "question": "Can I cancel a complaint?",
        "answer": "You can request to withdraw or mark a complaint as closed through the complaint management tab.",
        "keywords": ["cancel complaint", "withdraw report", "close complaint"],
        "intent": "file_complaint"
    },
    {
        "category": "complaint",
        "question": "What happens after I submit a complaint?",
        "answer": "After submission, your report is categorized, logged into the system, and reviewed by authorized personnel or added to safety analytical records.",
        "keywords": ["after submit", "complaint workflow", "process"],
        "intent": "file_complaint"
    },
    {
        "category": "complaint",
        "question": "Who receives my complaint?",
        "answer": "Your complaint is processed by Velora's secure management system and routed to designated safety coordinators or authorized authorities based on your submission settings.",
        "keywords": ["who receives", "who views", "complaint destination"],
        "intent": "file_complaint"
    },
    {
        "category": "complaint",
        "question": "Can police see my complaint?",
        "answer": "If you submit a formal complaint designated for authority action, authorized police officials with command dashboard access can review your report.",
        "keywords": ["police see", "authorities view", "police complaint"],
        "intent": "police_assistance"
    },
    {
        "category": "complaint",
        "question": "What if I accidentally submitted incorrect information?",
        "answer": "Open your complaint in the 'My Complaints' section and add an update clarifying the corrected information.",
        "keywords": ["incorrect info", "mistake", "wrong report", "correct details"],
        "intent": "complaint_update"
    },
    {
        "category": "complaint",
        "question": "Can I file an anonymous complaint?",
        "answer": "Yes, Velora provides options for anonymous reporting when flagging unsafe locations or community safety hazards.",
        "keywords": ["anonymous", "hide identity", "private report"],
        "intent": "report_incident"
    },
    {
        "category": "complaint",
        "question": "How long does complaint processing take?",
        "answer": "Processing times vary depending on the severity of the incident and authority review schedules. You can track status in real-time.",
        "keywords": ["processing time", "how long", "duration"],
        "intent": "complaint_status"
    },
    {
        "category": "complaint",
        "question": "Can I report domestic abuse?",
        "answer": "Yes. If you are in immediate physical danger, please call local emergency numbers or domestic violence helplines right away.",
        "keywords": ["domestic abuse", "violence", "report abuse"],
        "intent": "threat"
    },
    {
        "category": "complaint",
        "question": "How do I report harassment on public transport?",
        "answer": "File a report in the 'Report Incident' tab, specifying the transport mode (bus/metro/cab), route number, and location details.",
        "keywords": ["bus", "metro", "cab", "public transport harassment"],
        "intent": "harassment"
    },
    {
        "category": "complaint",
        "question": "Can I report workplace harassment?",
        "answer": "Yes, Velora allows reporting of workplace harassment incidents to document occurrences and seek guidance.",
        "keywords": ["workplace", "office harassment", "boss", "colleague"],
        "intent": "harassment"
    },
    {
        "category": "complaint",
        "question": "What counts as a safety incident?",
        "answer": "Safety incidents include physical assault, verbal harassment, stalking, unwanted touching, threats, suspicious activity, or unsafe environmental conditions.",
        "keywords": ["what counts", "incident types", "examples"],
        "intent": "report_incident"
    },
    {
        "category": "complaint",
        "question": "Will the accused person know who reported them?",
        "answer": "Velora protects user confidentiality in accordance with privacy policies and legal safety standards.",
        "keywords": ["accused know", "confidentiality", "identity protection"],
        "intent": "privacy"
    },
    {
        "category": "complaint",
        "question": "Can I view history of all my reports?",
        "answer": "Yes, all your submitted complaints and incident reports are archived in the 'My Complaints' section of your profile.",
        "keywords": ["history", "past complaints", "submitted reports"],
        "intent": "complaint_status"
    },
    {
        "category": "complaint",
        "question": "Is there a time limit for reporting an incident?",
        "answer": "There is no strict time limit on Velora, but reporting incidents as soon as possible ensures accurate data and faster response.",
        "keywords": ["time limit", "when to report", "delay"],
        "intent": "report_incident"
    },

    # 4. EMERGENCY SAFETY (18 items)
    {
        "category": "emergency",
        "question": "I am in danger. What should I do?",
        "answer": "If you are in immediate danger, prioritize your physical safety! Move to a populated, well-lit area immediately and call local emergency services (like 112 or 911) or your trusted emergency contacts.",
        "keywords": ["danger", "help", "emergency", "unsafe"],
        "intent": "emergency"
    },
    {
        "category": "emergency",
        "question": "Someone is following me.",
        "answer": "Head towards a brightly lit, crowded area immediately (such as a open store or station). Call a trusted friend or local police emergency numbers right away.",
        "keywords": ["following me", "stalked", "behind me", "followed"],
        "intent": "emergency"
    },
    {
        "category": "emergency",
        "question": "someone is following me what should I do?",
        "answer": "Do not go home or isolate yourself. Walk briskly to a crowded public space (like a shop or restaurant) and call emergency services or a trusted contact immediately.",
        "keywords": ["following", "followed", "what to do"],
        "intent": "emergency"
    },
    {
        "category": "emergency",
        "question": "I am being harassed right now.",
        "answer": "Stay calm, move toward other people, speak firmly to draw attention if safe, and contact local emergency numbers or nearby authorities immediately.",
        "keywords": ["harassed", "being harassed", "now"],
        "intent": "harassment"
    },
    {
        "category": "emergency",
        "question": "I am being threatened.",
        "answer": "Prioritize your immediate safety. Distance yourself from the threat, go to a safe location with other people, and call local emergency response services immediately.",
        "keywords": ["threatened", "threat", "danger"],
        "intent": "threat"
    },
    {
        "category": "emergency",
        "question": "I feel unsafe.",
        "answer": "Trust your instincts. Move to a well-lit, public place, stay in touch with a family member or friend, and access Velora safety features or call emergency services if needed.",
        "keywords": ["feel unsafe", "scared", "uncomfortable"],
        "intent": "emergency"
    },
    {
        "category": "emergency",
        "question": "Someone is attacking me!",
        "answer": "Shout loudly for help to attract attention, fight back or break free if necessary, and get to a safe place immediately while calling emergency services (112 / 911).",
        "keywords": ["attack", "attacked", "assault", "help"],
        "intent": "emergency"
    },
    {
        "category": "emergency",
        "question": "I am being stalked.",
        "answer": "Vary your routine, stay in populated areas, inform family/friends, and report the stalker to local law enforcement immediately.",
        "keywords": ["stalked", "stalker", "tracking me"],
        "intent": "stalking"
    },
    {
        "category": "emergency",
        "question": "I need immediate help!",
        "answer": "If this is a life-threatening emergency, please dial your local emergency services (112/911) or contact nearby police immediately!",
        "keywords": ["immediate help", "urgent", "sos"],
        "intent": "emergency"
    },
    {
        "category": "emergency",
        "question": "What should I do during an emergency?",
        "answer": "1. Stay calm and assess your surroundings. 2. Move to a well-lit, safe public area. 3. Call local emergency numbers or trusted contacts.",
        "keywords": ["during emergency", "steps", "protocol"],
        "intent": "emergency"
    },
    {
        "category": "emergency",
        "question": "How can Velora help me during an emergency?",
        "answer": "Velora provides immediate safety advice, quick access to emergency numbers, and incident logging tools. Please call emergency services directly for active physical dispatch.",
        "keywords": ["velora help emergency", "app emergency support"],
        "intent": "emergency"
    },
    {
        "category": "emergency",
        "question": "Can Velora call police for me automatically?",
        "answer": "Velora provides emergency contact buttons and direct dialing links, but you must initiate the emergency call from your device unless automatic calling features are explicitly configured.",
        "keywords": ["call police automatically", "dispatch", "auto call"],
        "intent": "emergency"
    },
    {
        "category": "emergency",
        "question": "What if I feel unsafe in a taxi or ride-share?",
        "answer": "Share your trip details with a friend, keep your GPS active, ask the driver to stop at a populated spot if uneasy, and dial emergency numbers if threatened.",
        "keywords": ["taxi", "cab", "ride share", "uber", "unsafe ride"],
        "intent": "emergency"
    },
    {
        "category": "emergency",
        "question": "What if my phone battery is low in an emergency?",
        "answer": "Send your current location immediately to your emergency contacts, lower screen brightness, and head to a public building or police station.",
        "keywords": ["low battery", "dying phone", "emergency phone"],
        "intent": "emergency"
    },
    {
        "category": "emergency",
        "question": "How do I alert my emergency contacts quickly?",
        "answer": "Keep your emergency contact numbers saved on speed dial or use your phone's built-in SOS shortcut in addition to Velora's emergency features.",
        "keywords": ["alert contacts", "speed dial", "sos shortcut"],
        "intent": "emergency"
    },
    {
        "category": "emergency",
        "question": "What if I cannot speak aloud during an emergency?",
        "answer": "Use text messaging or silent SOS alerts to contact trusted friends or emergency lines, or send your live location silently.",
        "keywords": ["cannot speak", "silent sos", "text emergency"],
        "intent": "emergency"
    },
    {
        "category": "emergency",
        "question": "I am lost in an unfamiliar dark area.",
        "answer": "Stay on main streets, enter an open business (gas station/restaurant), and use GPS navigation to reach a safer populated area.",
        "keywords": ["lost", "dark area", "unfamiliar street"],
        "intent": "emergency"
    },
    {
        "category": "emergency",
        "question": "Someone is trying to force me into a vehicle!",
        "answer": "Make noise, scream loudly, resist with all force, drop to the ground to make yourself harder to move, and call for help immediately!",
        "keywords": ["vehicle abduction", "forced in car", "kidnap threat"],
        "intent": "emergency"
    },

    # 5. POLICE / AUTHORITY QUESTIONS (12 items)
    {
        "category": "police",
        "question": "Can police see my complaint?",
        "answer": "Complaints submitted for official action can be accessed by authorized police officials through Velora's police dashboard portal.",
        "keywords": ["police see", "authorities view", "complaint access"],
        "intent": "police_assistance"
    },
    {
        "category": "police",
        "question": "How are complaints handled by authorities?",
        "answer": "Authorities review submitted complaints, verify incident details, update status logs, and initiate investigation or safety patrol measures.",
        "keywords": ["handled", "authorities", "process", "investigation"],
        "intent": "police_assistance"
    },
    {
        "category": "police",
        "question": "What happens after reporting an incident to police?",
        "answer": "Once logged, designated officers evaluate the report, update status notifications, and determine appropriate follow-up actions.",
        "keywords": ["after reporting", "police action", "follow up"],
        "intent": "police_assistance"
    },
    {
        "category": "police",
        "question": "Can authorities review my report?",
        "answer": "Yes, authorized law enforcement personnel can review reports routed to their jurisdiction via the Velora authority system.",
        "keywords": ["review report", "law enforcement", "authorities"],
        "intent": "police_assistance"
    },
    {
        "category": "police",
        "question": "How is complaint information processed?",
        "answer": "Information is securely encrypted, categorized by severity and location, and presented to safety operators for administrative review.",
        "keywords": ["processed", "complaint data", "security"],
        "intent": "police_assistance"
    },
    {
        "category": "police",
        "question": "Can I see the status of my complaint from police?",
        "answer": "Yes, any status updates made by police or safety coordinators will appear in your 'My Complaints' notification tab.",
        "keywords": ["police status", "update", "track police"],
        "intent": "police_assistance"
    },
    {
        "category": "police",
        "question": "How does Velora support police?",
        "answer": "Velora supports police by providing aggregated risk data, incident pattern mapping, and streamlined digital complaint intake.",
        "keywords": ["support police", "police tools", "law enforcement assistance"],
        "intent": "police_dashboard"
    },
    {
        "category": "police",
        "question": "What is the police command center?",
        "answer": "The police command center is an administrative portal in Velora where authorized officials monitor safety alerts, review complaints, and assess risk heatmaps.",
        "keywords": ["command center", "police portal", "admin dashboard"],
        "intent": "police_dashboard"
    },
    {
        "category": "police",
        "question": "What information is available to police?",
        "answer": "Police can view submitted incident descriptions, dates, locations, attached evidence, and status logs for reports within their jurisdiction.",
        "keywords": ["information available", "police data", "view details"],
        "intent": "police_assistance"
    },
    {
        "category": "police",
        "question": "Does Velora automatically dispatch police to my location?",
        "answer": "No. Velora is an information and reporting tool. For immediate police dispatch, you must contact local emergency services directly (e.g., 112/911).",
        "keywords": ["dispatch police", "auto police", "send officers"],
        "intent": "police_assistance"
    },
    {
        "category": "police",
        "question": "How are police officers verified on Velora?",
        "answer": "Police accounts undergo strict identity verification and administrative approval before gaining access to authority dashboards.",
        "keywords": ["verified police", "official accounts", "security check"],
        "intent": "police_dashboard"
    },
    {
        "category": "police",
        "question": "Can police contact me directly regarding my complaint?",
        "answer": "Yes, if follow-up details are needed, authorized officials may contact you using the contact details provided in your report.",
        "keywords": ["contact me", "police call", "follow up contact"],
        "intent": "police_assistance"
    },

    # 6. SAFETY ADVICE (20 items)
    {
        "category": "safety_advice",
        "question": "How can I stay safe while traveling alone?",
        "answer": "Plan your route in advance, stay alert, keep your phone charged, share live trip details with trusted contacts, and avoid unlit or isolated areas.",
        "keywords": ["traveling alone", "solo travel", "safety tips"],
        "intent": "travel_safety"
    },
    {
        "category": "safety_advice",
        "question": "What should I do if someone follows me?",
        "answer": "Cross the street, change direction, walk into an open business, keep your phone ready, and do not head straight home.",
        "keywords": ["someone follows me", "following", "behind me"],
        "intent": "travel_safety"
    },
    {
        "category": "safety_advice",
        "question": "How can I stay safe at night?",
        "answer": "Stick to well-lit streets, avoid wearing noise-canceling headphones, walk confidently, and stay aware of your surroundings.",
        "keywords": ["night safety", "walking at night", "dark street"],
        "intent": "travel_safety"
    },
    {
        "category": "safety_advice",
        "question": "What should I do if I feel unsafe in a public place?",
        "answer": "Move near security personnel or staff, stay close to groups of people, keep your phone in hand, and leave the area if possible.",
        "keywords": ["unsafe public place", "crowd", "mall", "station"],
        "intent": "safety_advice"
    },
    {
        "category": "safety_advice",
        "question": "How can I protect myself from online harassment?",
        "answer": "Keep social media profiles private, avoid sharing real-time location tags, block harassers, save evidence/screenshots, and report inappropriate behavior.",
        "keywords": ["online harassment", "cyberstalking", "social media safety"],
        "intent": "online_safety"
    },
    {
        "category": "safety_advice",
        "question": "What should I do if someone threatens me online?",
        "answer": "Do not respond to threats. Screenshot the messages, block the account, adjust privacy settings, and report the threat to online platforms and authorities.",
        "keywords": ["threatened online", "cyber threat", "messages"],
        "intent": "online_safety"
    },
    {
        "category": "safety_advice",
        "question": "How can I stay safe while using public transportation?",
        "answer": "Sit near the driver or conductor, stay awake, keep belongings close, and remain aware of nearby exits and passengers.",
        "keywords": ["public transport", "bus safety", "train safety"],
        "intent": "travel_safety"
    },
    {
        "category": "safety_advice",
        "question": "What precautions should I take when meeting someone online?",
        "answer": "Meet in a public place during daylight, inform a friend of your location, arrange your own transportation, and never share private financial details.",
        "keywords": ["meeting online", "date safety", "first date"],
        "intent": "online_safety"
    },
    {
        "category": "safety_advice",
        "question": "What should I do if I suspect stalking?",
        "answer": "Document dates/times of sightings, vary your daily routes, inform trusted people, secure your social accounts, and report the stalker to law enforcement.",
        "keywords": ["suspect stalking", "stalker tips", "prevention"],
        "intent": "stalking"
    },
    {
        "category": "safety_advice",
        "question": "How can I share my live location safely?",
        "answer": "Use built-in map apps or Velora features to share live location only with trusted family members or close friends.",
        "keywords": ["share location", "live location", "eta"],
        "intent": "travel_safety"
    },
    {
        "category": "safety_advice",
        "question": "What safety items should I keep in my bag?",
        "answer": "Consider keeping a fully charged power bank, personal safety alarm/whistle, emergency contact list, and small flashlight.",
        "keywords": ["safety items", "bag contents", "personal alarm"],
        "intent": "safety_advice"
    },
    {
        "category": "safety_advice",
        "question": "How should I handle catcalling or street harassment?",
        "answer": "Prioritize safety over confrontation. Keep walking towards a safe crowded place, ignore if possible, or firmly demand space if safe.",
        "keywords": ["catcalling", "street harassment", "verbal abuse"],
        "intent": "safety_advice"
    },
    {
        "category": "safety_advice",
        "question": "What if someone takes photos of me without permission?",
        "answer": "Move away to a safe place, notify security or staff nearby, and report non-consensual photography if it escalates.",
        "keywords": ["photos without permission", "creepy photo", "camera"],
        "intent": "safety_advice"
    },
    {
        "category": "safety_advice",
        "question": "How to stay safe in an unfamiliar city?",
        "answer": "Research safe neighborhoods beforehand, download offline maps, stay in vetted accommodations, and keep emergency numbers handy.",
        "keywords": ["unfamiliar city", "travel safety", "new location"],
        "intent": "travel_safety"
    },
    {
        "category": "safety_advice",
        "question": "What to do if a gathering or party turns unsafe?",
        "answer": "Leave immediately, call a trusted friend or ride service, never leave drinks unattended, and stay with people you trust.",
        "keywords": ["party safety", "gathering", "unsafe party"],
        "intent": "safety_advice"
    },
    {
        "category": "safety_advice",
        "question": "How to secure social media privacy?",
        "answer": "Set profiles to private, disable location tags on posts, review friend requests carefully, and turn on two-factor authentication.",
        "keywords": ["social media privacy", "privacy settings", "instagram safety"],
        "intent": "online_safety"
    },
    {
        "category": "safety_advice",
        "question": "What to do if suspicious noises are outside your home?",
        "answer": "Ensure doors and windows are locked, turn on exterior lights, stay inside, and call local police if you suspect an intruder.",
        "keywords": ["home safety", "suspicious noise", "intruder threat"],
        "intent": "safety_advice"
    },
    {
        "category": "safety_advice",
        "question": "How can I prepare a personal safety plan?",
        "answer": "Identify safe places along your routine routes, save emergency contacts on speed dial, and practice situational awareness.",
        "keywords": ["safety plan", "preparedness", "routine safety"],
        "intent": "safety_advice"
    },
    {
        "category": "safety_advice",
        "question": "How can young women develop situational awareness?",
        "answer": "Pay attention to surroundings, limit phone distractions while walking, trust gut feelings, and observe exit locations in new places.",
        "keywords": ["situational awareness", "awareness tips", "intuition"],
        "intent": "safety_advice"
    },
    {
        "category": "safety_advice",
        "question": "What to do if elevator ride feels unsafe?",
        "answer": "Stand near the control panel. If someone suspicious enters, press the next floor button and step out immediately into a public hall.",
        "keywords": ["elevator safety", "lift safety", "building safety"],
        "intent": "safety_advice"
    },

    # 7. LOCATION / RISK QUESTIONS (15 items)
    {
        "category": "location_risk",
        "question": "Is this area safe?",
        "answer": "Check Velora's risk map for location safety scores and reported incidents. Please exercise standard precautions regardless of safety ratings.",
        "keywords": ["area safe", "is location safe", "safety map"],
        "intent": "risk_information"
    },
    {
        "category": "location_risk",
        "question": "How can I identify risky areas?",
        "answer": "Use the Velora safety map. High-risk zones are flagged based on historical incident reports, poor lighting feedback, and analytical indicators.",
        "keywords": ["identify risky areas", "high risk zone", "danger zone"],
        "intent": "risk_information"
    },
    {
        "category": "location_risk",
        "question": "What does a high-risk area mean?",
        "answer": "A high-risk area designation indicates higher frequencies of past reported incidents or environmental safety concerns like poor street lighting.",
        "keywords": ["high risk area", "meaning", "risk score"],
        "intent": "risk_information"
    },
    {
        "category": "location_risk",
        "question": "Why is an area marked as risky?",
        "answer": "Areas are flagged due to reported safety incidents, lack of infrastructure (lighting/surveillance), or high density of past complaints.",
        "keywords": ["why risky", "flagged area", "risk factor"],
        "intent": "risk_information"
    },
    {
        "category": "location_risk",
        "question": "How is crime risk calculated?",
        "answer": "Crime risk is calculated using statistical modeling of historical reports, incident frequency, time of day, and environmental data.",
        "keywords": ["risk calculated", "crime risk formula", "calculation"],
        "intent": "crime_information"
    },
    {
        "category": "location_risk",
        "question": "What does the safety score mean?",
        "answer": "The safety score is an estimated index (0-100) reflecting relative security based on available data. Higher scores indicate safer historical trends.",
        "keywords": ["safety score", "score meaning", "rating"],
        "intent": "risk_information"
    },
    {
        "category": "location_risk",
        "question": "Can Velora identify crime-prone areas?",
        "answer": "Yes, Velora highlights crime-prone trends based on accumulated community reports and historical data analytics.",
        "keywords": ["crime prone", "identify crime", "hotspots"],
        "intent": "crime_information"
    },
    {
        "category": "location_risk",
        "question": "Why does the map show a warning?",
        "answer": "Map warnings indicate recent incident reports or flagged safety hazards in that specific geographical area.",
        "keywords": ["map warning", "warning icon", "alert on map"],
        "intent": "safety_alert"
    },
    {
        "category": "location_risk",
        "question": "What does a safety alert mean?",
        "answer": "A safety alert notifies users about recent incidents, active warnings, or caution advisories near their current or searched location.",
        "keywords": ["safety alert", "notification", "advisory"],
        "intent": "safety_alert"
    },
    {
        "category": "location_risk",
        "question": "How frequently is risk information updated?",
        "answer": "Risk information updates whenever new complaints are submitted or system analytics refresh safety data indexes.",
        "keywords": ["risk update frequency", "realtime map", "data refresh"],
        "intent": "risk_information"
    },
    {
        "category": "location_risk",
        "question": "Can I report an unlit street on the map?",
        "answer": "Yes, you can report unsafe environmental conditions like non-functional streetlights using the 'Report Unsafe Location' option.",
        "keywords": ["unlit street", "dark spot", "broken light"],
        "intent": "unsafe_location"
    },
    {
        "category": "location_risk",
        "question": "Does a low safety score mean crime will happen?",
        "answer": "No. Safety scores are statistical estimates based on historical patterns and do not guarantee specific future events.",
        "keywords": ["guarantee", "low score prediction", "certainty"],
        "intent": "risk_information"
    },
    {
        "category": "location_risk",
        "question": "Does Velora track my GPS continuously?",
        "answer": "Velora accesses location services only when granted permission by the user for mapping, safety alerts, or reporting features.",
        "keywords": ["gps tracking", "continuous tracking", "location privacy"],
        "intent": "privacy"
    },
    {
        "category": "location_risk",
        "question": "Why is there limited data for some areas?",
        "answer": "Areas with fewer submitted user complaints or sparse historical records may display limited risk data.",
        "keywords": ["limited data", "no data", "rural area risk"],
        "intent": "risk_information"
    },
    {
        "category": "location_risk",
        "question": "What to do if traveling through a red-flagged area?",
        "answer": "Stay on main roads, travel with companions if possible, keep phone charged, and maintain high situational awareness.",
        "keywords": ["red flagged area", "travel high risk", "precautions"],
        "intent": "travel_safety"
    },

    # 8. AI / MACHINE LEARNING QUESTIONS (14 items)
    {
        "category": "ai_ml",
        "question": "How does AI help Velora?",
        "answer": "AI assists Velora by powering the intelligent safety chatbot, analyzing safety patterns from incident reports, and estimating area risk levels.",
        "keywords": ["ai help", "ai role", "artificial intelligence"],
        "intent": "ai_features"
    },
    {
        "category": "ai_ml",
        "question": "What does the AI chatbot do?",
        "answer": "The AI chatbot answers safety queries, provides incident reporting instructions, offers safety advice, and guides users through Velora features.",
        "keywords": ["chatbot role", "what chatbot does", "ai assistant"],
        "intent": "chatbot_capabilities"
    },
    {
        "category": "ai_ml",
        "question": "How does machine learning help the platform?",
        "answer": "Machine learning processes historical safety data to discover trends, evaluate risk factors, and deliver intelligent conversational assistance.",
        "keywords": ["machine learning", "ml help", "data analytics"],
        "intent": "machine_learning"
    },
    {
        "category": "ai_ml",
        "question": "Why does Velora use crime data?",
        "answer": "Velora analyzes crime and incident data to help users understand area safety dynamics and take proactive safety measures.",
        "keywords": ["crime data", "why use data", "safety analytics"],
        "intent": "crime_information"
    },
    {
        "category": "ai_ml",
        "question": "How is crime data analyzed?",
        "answer": "Data is aggregated, anonymized, and processed using pattern recognition algorithms to generate location risk insights.",
        "keywords": ["analyzed", "data processing", "ml algorithms"],
        "intent": "machine_learning"
    },
    {
        "category": "ai_ml",
        "question": "What is the purpose of the ML model?",
        "answer": "The ML model helps identify high-risk safety patterns and support automated safety risk scoring across geographic zones.",
        "keywords": ["ml model", "model purpose", "algorithm"],
        "intent": "machine_learning"
    },
    {
        "category": "ai_ml",
        "question": "How does Velora identify patterns?",
        "answer": "Velora groups incident data by time, location, incident type, and environmental factors to spot safety trends.",
        "keywords": ["identify patterns", "trends", "pattern recognition"],
        "intent": "machine_learning"
    },
    {
        "category": "ai_ml",
        "question": "Can AI predict crime?",
        "answer": "No. AI cannot predict specific crimes with certainty. It provides statistical risk estimates based on historical data patterns.",
        "keywords": ["predict crime", "ai prediction", "future crime"],
        "intent": "crime_prediction"
    },
    {
        "category": "ai_ml",
        "question": "Is the AI prediction guaranteed?",
        "answer": "No. Machine learning predictions are estimates based on available historical data and should never be treated as guaranteed facts.",
        "keywords": ["guaranteed", "accurate 100", "prediction certainty"],
        "intent": "crime_prediction"
    },
    {
        "category": "ai_ml",
        "question": "How accurate are AI predictions?",
        "answer": "Accuracy depends on the quality and volume of historical data available. Predictions are advisory risk estimates, not certainties.",
        "keywords": ["accuracy", "how accurate", "reliable"],
        "intent": "crime_prediction"
    },
    {
        "category": "ai_ml",
        "question": "Does the AI chatbot learn from user conversations?",
        "answer": "The chatbot utilizes pretrained language models and knowledge databases to answer queries safely without storing private personal chat conversations for training.",
        "keywords": ["learn chat", "training data", "chat learning"],
        "intent": "ai_features"
    },
    {
        "category": "ai_ml",
        "question": "Can AI replace emergency responders or police?",
        "answer": "No. AI tools provide information and guidance but can never replace real human emergency services or law enforcement officers.",
        "keywords": ["replace police", "replace responders", "ai vs human"],
        "intent": "ai_features"
    },
    {
        "category": "ai_ml",
        "question": "How does Velora prevent AI bias in risk assessment?",
        "answer": "Velora uses objective incident metrics, environmental data, and multi-source verification to minimize analytical bias.",
        "keywords": ["ai bias", "fairness", "objective risk"],
        "intent": "machine_learning"
    },
    {
        "category": "ai_ml",
        "question": "What AI model powers this chatbot?",
        "answer": "This chatbot is powered by advanced LLM integration tuned with Velora's women safety knowledge base.",
        "keywords": ["llm", "ai model", "gemini", "technology"],
        "intent": "ai_features"
    },

    # 9. CHATBOT QUESTIONS (14 items)
    {
        "category": "chatbot",
        "question": "What can you do?",
        "answer": "I am Velora's AI safety assistant. I can help you with safety advice, incident reporting instructions, platform navigation, and risk information.",
        "keywords": ["what can you do", "capabilities", "features"],
        "intent": "chatbot_capabilities"
    },
    {
        "category": "chatbot",
        "question": "How can you help me?",
        "answer": "I can answer questions about women's safety, guide you on how to file complaints, explain Velora features, and provide practical safety precautions.",
        "keywords": ["how help me", "assistance", "support"],
        "intent": "chatbot_capabilities"
    },
    {
        "category": "chatbot",
        "question": "Are you a real person?",
        "answer": "No, I am an AI assistant created to support users on the Velora Women Safety Platform.",
        "keywords": ["real person", "human", "ai or human"],
        "intent": "chatbot_capabilities"
    },
    {
        "category": "chatbot",
        "question": "Are you an AI?",
        "answer": "Yes! I am the official AI virtual assistant for Velora.",
        "keywords": ["are you ai", "virtual assistant", "bot"],
        "intent": "chatbot_capabilities"
    },
    {
        "category": "chatbot",
        "question": "Can you report a complaint for me?",
        "answer": "I can guide you step-by-step on how to file a complaint in Velora, but you need to submit the complaint form yourself through your account.",
        "keywords": ["file for me", "report for me", "auto submit"],
        "intent": "chatbot_capabilities"
    },
    {
        "category": "chatbot",
        "question": "Can you contact police for me?",
        "answer": "No, I cannot directly make phone calls or dispatch police. In an emergency, please dial local emergency services (112 or 911) directly.",
        "keywords": ["contact police", "call 911 for me", "dispatch"],
        "intent": "chatbot_capabilities"
    },
    {
        "category": "chatbot",
        "question": "Can you track my location?",
        "answer": "I do not track your location during chat. Location services in Velora are managed through your browser/device permissions.",
        "keywords": ["track location", "where am i", "my location"],
        "intent": "privacy"
    },
    {
        "category": "chatbot",
        "question": "Can you identify an attacker?",
        "answer": "No, I do not possess facial recognition or offender identification capabilities.",
        "keywords": ["identify attacker", "facial recognition", "find suspect"],
        "intent": "chatbot_capabilities"
    },
    {
        "category": "chatbot",
        "question": "Can you give legal advice?",
        "answer": "No, I can provide general safety information and reporting guidance, but I cannot offer formal legal counsel.",
        "keywords": ["legal advice", "lawyer", "legal representation"],
        "intent": "chatbot_capabilities"
    },
    {
        "category": "chatbot",
        "question": "Can you tell me if an area is dangerous?",
        "answer": "I can share risk statistics and safety scores available on Velora, but please remain cautious as conditions can change.",
        "keywords": ["is area dangerous", "tell danger"],
        "intent": "risk_information"
    },
    {
        "category": "chatbot",
        "question": "Can I ask you safety questions?",
        "answer": "Yes! Feel free to ask any questions regarding travel safety, online security, harassment protocols, or Velora tools.",
        "keywords": ["ask safety questions", "guidance"],
        "intent": "chatbot_capabilities"
    },
    {
        "category": "chatbot",
        "question": "Can I use you during an emergency?",
        "answer": "You can ask for quick safety advice, but if you are in immediate danger, always prioritize calling local emergency services (112/911) first!",
        "keywords": ["use in emergency", "emergency bot"],
        "intent": "emergency"
    },
    {
        "category": "chatbot",
        "question": "What languages do you understand?",
        "answer": "Currently I am optimized for English, but I can understand common safety queries in simple conversational terms.",
        "keywords": ["languages", "english", "multilingual"],
        "intent": "chatbot_capabilities"
    },
    {
        "category": "chatbot",
        "question": "What should I do if you don't understand my question?",
        "answer": "Try rephrasing your question using simple keywords like 'report', 'login', 'emergency', or 'safety tips'.",
        "keywords": ["dont understand", "rephrase", "confused bot"],
        "intent": "chatbot_capabilities"
    },

    # 10. PRIVACY AND SECURITY (12 items)
    {
        "category": "privacy",
        "question": "Is my information safe?",
        "answer": "Velora prioritizes user privacy and employs standard data encryption and security protocols to safeguard user data.",
        "keywords": ["information safe", "data privacy", "secure"],
        "intent": "security"
    },
    {
        "category": "privacy",
        "question": "Who can see my complaint?",
        "answer": "Visibility depends on your reporting settings. Formal authority reports are viewable by authorized officials, while anonymous entries hide personal identity.",
        "keywords": ["who can see complaint", "visibility", "privacy"],
        "intent": "privacy"
    },
    {
        "category": "privacy",
        "question": "Is my personal information protected?",
        "answer": "Yes, personal details are protected under Velora's privacy controls and are not shared publicly.",
        "keywords": ["personal info protected", "data protection"],
        "intent": "privacy"
    },
    {
        "category": "privacy",
        "question": "Is my conversation private?",
        "answer": "Chat interactions with the AI assistant are designed for user privacy and are handled securely.",
        "keywords": ["chat private", "conversation privacy"],
        "intent": "privacy"
    },
    {
        "category": "privacy",
        "question": "How is my data used?",
        "answer": "Data is used to manage your account, process complaints, compute anonymized safety statistics, and improve platform services.",
        "keywords": ["how data used", "data usage", "purpose"],
        "intent": "privacy"
    },
    {
        "category": "privacy",
        "question": "Can someone unauthorized access my account?",
        "answer": "Accounts are protected by password authentication. Keep your login credentials private to prevent unauthorized access.",
        "keywords": ["unauthorized access", "hacked", "account security"],
        "intent": "security"
    },
    {
        "category": "privacy",
        "question": "How does Velora protect user information?",
        "answer": "Velora utilizes encryption in transit, secure database storage, and access control policies for authority management.",
        "keywords": ["how protect info", "encryption", "security protocols"],
        "intent": "security"
    },
    {
        "category": "privacy",
        "question": "Is my location shared publicly?",
        "answer": "No. Your precise live location is never published publicly on the app.",
        "keywords": ["location shared publicly", "public location"],
        "intent": "privacy"
    },
    {
        "category": "privacy",
        "question": "Can police access my profile without a complaint?",
        "answer": "No, police access is restricted to official submitted reports and incident management workflows.",
        "keywords": ["police profile access", "unsolicited access"],
        "intent": "privacy"
    },
    {
        "category": "privacy",
        "question": "Are uploaded evidence photos encrypted?",
        "answer": "Yes, media files attached to complaints are stored securely with restricted access permissions.",
        "keywords": ["evidence encrypted", "photo privacy", "secure files"],
        "intent": "security"
    },
    {
        "category": "privacy",
        "question": "Does Velora sell user data?",
        "answer": "No. Velora does not sell personal user data to third-party advertisers or commercial brokers.",
        "keywords": ["sell data", "third party brokers", "monetize data"],
        "intent": "privacy"
    },
    {
        "category": "privacy",
        "question": "How can I manage my privacy settings?",
        "answer": "You can manage data sharing and notification preferences in the Account Settings -> Privacy menu.",
        "keywords": ["manage privacy settings", "privacy controls"],
        "intent": "privacy"
    },

    # 11. NOTIFICATIONS (10 items)
    {
        "category": "notifications",
        "question": "Why did I receive a safety notification?",
        "answer": "Notifications are sent to alert you about safety advisories near your location or updates on your submitted complaints.",
        "keywords": ["why notification", "safety alert received"],
        "intent": "notifications"
    },
    {
        "category": "notifications",
        "question": "How do I know if my complaint was updated?",
        "answer": "You will receive an in-app notification and see status changes under the 'My Complaints' section.",
        "keywords": ["complaint updated notification", "status update"],
        "intent": "notifications"
    },
    {
        "category": "notifications",
        "question": "Can I disable notifications?",
        "answer": "Yes, you can toggle notification preferences in Account Settings -> Notifications.",
        "keywords": ["disable notifications", "turn off alerts", "mute"],
        "intent": "notifications"
    },
    {
        "category": "notifications",
        "question": "What are real-time safety alerts?",
        "answer": "Real-time safety alerts inform users about newly flagged high-risk zones or emergency incidents nearby.",
        "keywords": ["realtime alerts", "safety warning alerts"],
        "intent": "notifications"
    },
    {
        "category": "notifications",
        "question": "Why am I not receiving safety alerts?",
        "answer": "Check your device notification permissions and ensure notifications are enabled in your Velora app settings.",
        "keywords": ["not receiving alerts", "missing notifications"],
        "intent": "notifications"
    },
    {
        "category": "notifications",
        "question": "How do police updates appear?",
        "answer": "Police status changes are pushed as status update notifications directly to your account dashboard.",
        "keywords": ["police updates notification", "status push"],
        "intent": "notifications"
    },
    {
        "category": "notifications",
        "question": "Will I get notified of nearby incidents?",
        "answer": "If nearby alerts are enabled in your settings, Velora sends warnings for verified incidents in your region.",
        "keywords": ["nearby incidents", "location alerts"],
        "intent": "notifications"
    },
    {
        "category": "notifications",
        "question": "Can I choose which notifications to get?",
        "answer": "Yes, you can filter alert categories (such as complaint updates, risk warnings, or general safety tips) in settings.",
        "keywords": ["choose notifications", "notification filter"],
        "intent": "notifications"
    },
    {
        "category": "notifications",
        "question": "Do notifications work in the background?",
        "answer": "Yes, push notifications function in the background if system notifications are granted for the application.",
        "keywords": ["background notifications", "push alerts"],
        "intent": "notifications"
    },
    {
        "category": "notifications",
        "question": "How can I clear old safety notifications?",
        "answer": "Click the 'Clear All' button in the notification panel to dismiss old alerts.",
        "keywords": ["clear notifications", "dismiss alerts"],
        "intent": "notifications"
    },

    # 12. GENERAL CONVERSATION (12 items)
    {
        "category": "general_convo",
        "question": "Hello",
        "answer": "Hello! I am your Velora AI Safety Assistant. How can I assist you today?",
        "keywords": ["hello", "hi", "greetings"],
        "intent": "greeting"
    },
    {
        "category": "general_convo",
        "question": "Hi",
        "answer": "Hi there! Welcome to Velora. How can I help you stay safe today?",
        "keywords": ["hi", "hey"],
        "intent": "greeting"
    },
    {
        "category": "general_convo",
        "question": "Hey",
        "answer": "Hey! How can I assist you with Velora features or safety advice?",
        "keywords": ["hey", "hello"],
        "intent": "greeting"
    },
    {
        "category": "general_convo",
        "question": "Good morning",
        "answer": "Good morning! Wishing you a safe day ahead. How can I help you today?",
        "keywords": ["good morning", "morning"],
        "intent": "greeting"
    },
    {
        "category": "general_convo",
        "question": "Thank you",
        "answer": "You're very welcome! Stay safe, and let me know if you need anything else.",
        "keywords": ["thank you", "thanks"],
        "intent": "greeting"
    },
    {
        "category": "general_convo",
        "question": "Thanks a lot",
        "answer": "Glad I could help! Take care and stay safe.",
        "keywords": ["thanks", "thankful"],
        "intent": "greeting"
    },
    {
        "category": "general_convo",
        "question": "Okay",
        "answer": "Understood! Let me know if you have any other safety questions.",
        "keywords": ["okay", "ok", "got it"],
        "intent": "greeting"
    },
    {
        "category": "general_convo",
        "question": "What can you do?",
        "answer": "I can assist you with incident reporting guidance, safety tips, platform features, and risk information.",
        "keywords": ["what can you do", "help"],
        "intent": "help"
    },
    {
        "category": "general_convo",
        "question": "Help me",
        "answer": "I am here to help! If you are in immediate physical danger, call emergency services (112/911). Otherwise, tell me what you need assistance with.",
        "keywords": ["help me", "assistance"],
        "intent": "help"
    },
    {
        "category": "general_convo",
        "question": "I need assistance",
        "answer": "How can I assist you? You can ask about reporting incidents, safety tips, account settings, or risk maps.",
        "keywords": ["need assistance", "help"],
        "intent": "help"
    },
    {
        "category": "general_convo",
        "question": "Can you help me?",
        "answer": "Yes, absolutely! Ask me any question about Velora, women's safety advice, or complaint tracking.",
        "keywords": ["can you help me", "support"],
        "intent": "help"
    },
    {
        "category": "general_convo",
        "question": "Tell me about Velora",
        "answer": "Velora is an AI-powered Women Safety Platform providing incident reporting, risk visualizers, and safety guidance. How can I help you explore its features?",
        "keywords": ["tell me about velora", "info"],
        "intent": "about_velora"
    },

    # 13. UNKNOWN QUESTIONS (8 items)
    {
        "category": "unknown",
        "question": "What is the recipe for chocolate cake?",
        "answer": "I'm sorry, I don't have enough information to answer that accurately. I can help you with Velora features, safety guidance, incident reporting, complaints, and related questions.",
        "keywords": ["recipe", "cake", "food"],
        "intent": "unknown"
    },
    {
        "category": "unknown",
        "question": "Who won the football match yesterday?",
        "answer": "I'm sorry, I don't have enough information to answer that accurately. I can help you with Velora features, safety guidance, incident reporting, complaints, and related questions.",
        "keywords": ["football", "sports", "match"],
        "intent": "unknown"
    },
    {
        "category": "unknown",
        "question": "Can you write a Python code for sorting numbers?",
        "answer": "I'm sorry, I don't have enough information to answer that accurately. I can help you with Velora features, safety guidance, incident reporting, complaints, and related questions.",
        "keywords": ["python", "code", "sorting"],
        "intent": "unknown"
    },
    {
        "category": "unknown",
        "question": "What is the stock price of Apple today?",
        "answer": "I'm sorry, I don't have enough information to answer that accurately. I can help you with Velora features, safety guidance, incident reporting, complaints, and related questions.",
        "keywords": ["stock", "apple", "finance"],
        "intent": "unknown"
    },
    {
        "category": "unknown",
        "question": "Can you tell me a joke?",
        "answer": "I'm sorry, I don't have enough information to answer that accurately. I can help you with Velora features, safety guidance, incident reporting, complaints, and related questions.",
        "keywords": ["joke", "funny", "humor"],
        "intent": "unknown"
    },
    {
        "category": "unknown",
        "question": "What is the weather forecast in Paris tomorrow?",
        "answer": "I'm sorry, I don't have enough information to answer that accurately. I can help you with Velora features, safety guidance, incident reporting, complaints, and related questions.",
        "keywords": ["weather", "paris", "forecast"],
        "intent": "unknown"
    },
    {
        "category": "unknown",
        "question": "How do I fix a broken car engine?",
        "answer": "I'm sorry, I don't have enough information to answer that accurately. I can help you with Velora features, safety guidance, incident reporting, complaints, and related questions.",
        "keywords": ["car engine", "mechanic", "fix car"],
        "intent": "unknown"
    },
    {
        "category": "unknown",
        "question": "Can you play my favorite song?",
        "answer": "I'm sorry, I don't have enough information to answer that accurately. I can help you with Velora features, safety guidance, incident reporting, complaints, and related questions.",
        "keywords": ["play song", "music", "audio"],
        "intent": "unknown"
    }
]

# Write velora_chatbot_knowledge.json
with open("d:/chatbot/velora_chatbot_knowledge.json", "w", encoding="utf-8") as f:
    json.dump(knowledge_dataset, f, indent=2, ensure_ascii=False)

# Also save in src/data/ if directory exists or create it
os.makedirs("d:/chatbot/src/data", exist_ok=True)
with open("d:/chatbot/src/data/velora_chatbot_knowledge.json", "w", encoding="utf-8") as f:
    json.dump(knowledge_dataset, f, indent=2, ensure_ascii=False)

# Build velora_intents.json
intents_dict = {}
for item in knowledge_dataset:
    intent_name = item["intent"]
    if intent_name not in intents_dict:
        intents_dict[intent_name] = {
            "category": item["category"],
            "examples": [],
            "keywords": list(set(item["keywords"]))
        }
    intents_dict[intent_name]["examples"].append(item["question"])
    intents_dict[intent_name]["keywords"] = list(set(intents_dict[intent_name]["keywords"] + item["keywords"]))

intents_output = {
    "platform": "Velora AI Women Safety Platform",
    "total_intents": len(intents_dict),
    "intents": [
        {
            "intent": name,
            "category": data["category"],
            "keywords": data["keywords"],
            "example_phrases": data["examples"]
        }
        for name, data in intents_dict.items()
    ]
}

with open("d:/chatbot/velora_intents.json", "w", encoding="utf-8") as f:
    json.dump(intents_output, f, indent=2, ensure_ascii=False)

with open("d:/chatbot/src/data/velora_intents.json", "w", encoding="utf-8") as f:
    json.dump(intents_output, f, indent=2, ensure_ascii=False)

print(f"Successfully generated {len(knowledge_dataset)} Q&A dataset items across {len(intents_dict)} intents.")
