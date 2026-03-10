import re

with open('utils/full_syllabus_data.ts', 'r', encoding='utf-8') as f:
    content = f.read()

# Define the replacements manually.

replacements = {
    '"BSEB-10-Science": [': '''"BSEB-10-Physics": [
    "प्रकाश-परावर्तन तथा अपवर्तन",
    "मानव नेत्र तथा रंगबिरंगा संसार",
    "विद्युत",
    "विद्युत धारा के चुंबकीय प्रभाव",
    "ऊर्जा के स्रोत"
  ],
  "BSEB-10-Chemistry": [
    "रासायनिक अभिक्रियाएँ एवं समीकरण",
    "अम्ल, क्षारक एवं लवण",
    "धातु एवं अधातु",
    "कार्बन एवं उसके यौगिक",
    "तत्वों का आवर्त वर्गीकरण"
  ],
  "BSEB-10-Biology": [
    "जैव प्रक्रम",
    "नियंत्रण एवं समन्वय",
    "जीव जनन कैसे करते हैं",
    "आनुवंशिकता एवं जैव विकास",
    "हमारा पर्यावरण",
    "प्राकृतिक संसाधनों का प्रबंधन"
  ],
  "BSEB-10-Science": [''',

    '"BSEB-9-Science": [': '''"BSEB-9-Physics": [
    "गति",
    "बल तथा गति के नियम",
    "गुरुत्वाकर्षण",
    "कार्य तथा ऊर्जा",
    "ध्वनि"
  ],
  "BSEB-9-Chemistry": [
    "हमारे आस-पास के पदार्थ",
    "क्या हमारे आस-पास के पदार्थ शुद्ध हैं",
    "परमाणु एवं अणु",
    "परमाणु की संरचना"
  ],
  "BSEB-9-Biology": [
    "जीवन की मौलिक इकाई",
    "ऊतक",
    "जीवों में विविधता",
    "हम बीमार क्यों होते हैं",
    "प्राकृतिक संपदा",
    "खाद्य संसाधनों में सुधार"
  ],
  "BSEB-9-Science": [''',

    '"CBSE-10-Science": [': '''"CBSE-10-Physics": [
    "Light – Reflection and Refraction",
    "The Human Eye and the Colourful World",
    "Electricity",
    "Magnetic Effects of Electric Current"
  ],
  "CBSE-10-Chemistry": [
    "Chemical Reactions and Equations",
    "Acids, Bases and Salts",
    "Metals and Non-Metals",
    "Carbon and its Compounds"
  ],
  "CBSE-10-Biology": [
    "Life Processes",
    "Control and Coordination",
    "How do Organisms Reproduce?",
    "Heredity",
    "Our Environment"
  ],
  "CBSE-10-Science": [''',

    '"CBSE-9-Science": [': '''"CBSE-9-Physics": [
    "Motion",
    "Force and Laws of Motion",
    "Gravitation",
    "Work and Energy",
    "Sound"
  ],
  "CBSE-9-Chemistry": [
    "Matter in Our Surroundings",
    "Is Matter Around Us Pure",
    "Atoms and Molecules",
    "Structure of the Atom"
  ],
  "CBSE-9-Biology": [
    "The Fundamental Unit of Life",
    "Tissues",
    "Improvement in Food Resources"
  ],
  "CBSE-9-Science": ['''
}

# The user explicitly asked for 9 & 10 History, Geo, PolSci, Eco for BSEB. It's already provided in prompt.
# Let's add BSEB 9 & 10 Social Science splits.
bseb_ss_splits = '''
  "BSEB-9-History": [
    "भौगोलिक खोजें",
    "अमेरिकी स्वतंत्रता संग्राम",
    "फ्रांस की क्रांति",
    "विश्व युद्धों का इतिहास",
    "नाजीवाद",
    "वन्य समाज और उपनिवेशवाद",
    "शान्ति के प्रयास",
    "कृषि और खेतिहर समाज"
  ],
  "BSEB-9-Geography": [
    "स्थिति एवं विस्तार",
    "भौतिक स्वरूप : संरचना एवं उच्चावच",
    "अपवाह स्वरूप",
    "जलवायु",
    "प्राकृतिक वनस्पति एवं वन्य प्राणी",
    "जनसंख्या",
    "भारत के पड़ोसी देश",
    "मानचित्र अध्ययन",
    "क्षेत्रीय अध्ययन",
    "आपदा प्रबंधन : एक परिचय",
    "मानवीय गलतियों के कारण घटित आपदाएँ : नाभिकीय, जैविक और रासायनिक",
    "सामान्य आपदाएँ : निवारण एवं नियंत्रण",
    "समुदाय आधारित आपदा प्रबंधन"
  ],
  "BSEB-9-Political Science": [
    "लोकतंत्र का क्रमिक विकास",
    "लोकतंत्र क्या और क्यों?",
    "संविधान निर्माण",
    "चुनावी राजनीति",
    "संसदीय लोकतंत्र की संस्थाएँ",
    "लोकतांत्रिक अधिकार"
  ],
  "BSEB-9-Economics": [
    "बिहार के एक गाँव की आर्थिक कहानी",
    "मानव संसाधन",
    "गरीबी",
    "बेरोजगारी",
    "कृषि एवं खाद्यान्न सुरक्षा",
    "कृषि मजदूरों की समस्याएँ"
  ],
  "BSEB-10-History": [
    "यूरोप में राष्ट्रवाद",
    "समाजवाद एवं साम्यवाद",
    "हिन्द-चीन में राष्ट्रवादी आन्दोलन",
    "भारत में राष्ट्रवाद",
    "अर्थव्यवस्था और आजीविका",
    "शहरीकरण एवं शहरी जीवन",
    "व्यापार और भूमंडलीकरण",
    "प्रेस-संस्कृति एवं राष्ट्रवाद"
  ],
  "BSEB-10-Geography": [
    "संसाधन, विकास और उपयोग",
    "भूमि और मृदा संसाधन",
    "जल संसाधन",
    "वन और वन्य प्राणी संसाधन",
    "खनिज संसाधन",
    "ऊर्जा या शक्ति संसाधन",
    "कृषि संसाधन",
    "निर्माण उद्योग",
    "परिवहन, संचार और व्यापार",
    "बिहार - संसाधन एवं उपयोग",
    "मानचित्र-अध्ययन (उच्चावच प्रदर्शन)",
    "प्राकृतिक संकट और आपदा",
    "आपदा प्रबंधन"
  ],
  "BSEB-10-Political Science": [
    "लोकतंत्र में सत्ता की साझेदारी",
    "सत्ता में साझेदारी की कार्यप्रणाली",
    "लोकतंत्र में प्रतिस्पर्धा एवं संघर्ष",
    "लोकतंत्र की उपलब्धियाँ",
    "लोकतंत्र की चुनौतियों"
  ],
  "BSEB-10-Economics": [
    "अर्थव्यवस्था एवं इसके विकास का इतिहास",
    "राज्य एवं राष्ट्र की आय",
    "मुद्रा, बचत एवं साख",
    "हमारी वित्तीय संस्थाएँ",
    "रोजगार एवं सेवाएँ",
    "वैश्वीकरण",
    "उपभोक्ता जागरण एवं संरक्षण"
  ],
'''

replacements['"BSEB-10-Social Science": ['] = bseb_ss_splits + '"BSEB-10-Social Science": ['

cbse_ss_splits = '''
  "CBSE-9-History": [
    "The French Revolution",
    "Socialism in Europe and the Russian Revolution",
    "Nazism and the Rise of Hitler",
    "Forest Society and Colonialism",
    "Pastoralists in the Modern World"
  ],
  "CBSE-9-Geography": [
    "India – Size and Location",
    "Physical Features of India",
    "Drainage",
    "Climate",
    "Natural Vegetation and Wildlife",
    "Population"
  ],
  "CBSE-9-Political Science": [
    "What is Democracy? Why Democracy?",
    "Constitutional Design",
    "Electoral Politics",
    "Working of Institutions",
    "Democratic Rights"
  ],
  "CBSE-9-Economics": [
    "The Story of Village Palampur",
    "People as Resource",
    "Poverty as a Challenge",
    "Food Security in India"
  ],
  "CBSE-10-History": [
    "The Rise of Nationalism in Europe",
    "Nationalism in India",
    "The Making of a Global World",
    "The Age of Industrialisation",
    "Print Culture and the Modern World"
  ],
  "CBSE-10-Geography": [
    "Resources and Development",
    "Forest and Wildlife Resources",
    "Water Resources",
    "Agriculture",
    "Minerals and Energy Resources",
    "Manufacturing Industries",
    "Lifelines of National Economy"
  ],
  "CBSE-10-Political Science": [
    "Power Sharing",
    "Federalism",
    "Gender, Religion and Caste",
    "Political Parties",
    "Outcomes of Democracy"
  ],
  "CBSE-10-Economics": [
    "Development",
    "Sectors of the Indian Economy",
    "Money and Credit",
    "Globalisation and the Indian Economy",
    "Consumer Rights"
  ],
'''

replacements['"CBSE-10-Social Science": ['] = cbse_ss_splits + '"CBSE-10-Social Science": ['

for old, new in replacements.items():
    content = content.replace(old, new)

# Wait, we also need to split Class 6-8 Social Science into History, Geography, Political Science.
# The user said: "Class 6 to 8 suppurt jarega social science ke jagah pe histroy geography political science"
# I don't have the exact split for CBSE/BSEB 6-8, but I can approximate based on the current Social Science lists.

# Let's write the file and then figure out 6-8.
with open('utils/full_syllabus_data_new.ts', 'w', encoding='utf-8') as f:
    f.write(content)
