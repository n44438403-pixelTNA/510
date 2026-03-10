import re

with open('utils/full_syllabus_data.ts', 'r', encoding='utf-8') as f:
    content = f.read()

replacements = {}

# Class 8 CBSE
cbse_8_ss = '''"CBSE-8-History": [
    "How, When and Where",
    "From Trade to Territory",
    "Ruling the Countryside",
    "Tribals, Dikus and the Vision of a Golden Age",
    "When People Rebel",
    "Weavers, Iron Smelters and Factory Owners",
    "Civilising the 'Native', Educating the Nation",
    "Women, Caste and Reform",
    "The Making of the National Movement",
    "India After Independence"
  ],
  "CBSE-8-Geography": [
    "Resources",
    "Land, Soil, Water, Natural Vegetation and Wildlife",
    "Mineral and Power Resources",
    "Agriculture",
    "Industries",
    "Human Resources"
  ],
  "CBSE-8-Political Science": [
    "The Indian Constitution",
    "Understanding Secularism"
  ],'''

replacements['"CBSE-8-Social Science": ['] = cbse_8_ss + '\n  "CBSE-8-Social Science": ['

# Class 7 CBSE
cbse_7_ss = '''"CBSE-7-History": [
    "Tracing Changes Through a Thousand Years",
    "New Kings and Kingdoms",
    "The Delhi Sultans",
    "The Mughal Empire",
    "Rulers and Buildings",
    "Towns, Traders and Craftspersons",
    "Tribes, Nomads and Settled Communities",
    "Devotional Paths to the Divine",
    "The Making of Regional Cultures",
    "Eighteenth-Century Political Formations"
  ],
  "CBSE-7-Geography": [
    "Environment",
    "Inside Our Earth",
    "Our Changing Earth",
    "Air",
    "Water",
    "Natural Vegetation and Wildlife"
  ],
  "CBSE-7-Political Science": [
    "Equality",
    "Role of the Government in Health",
    "How the State Government Works",
    "Growing up as Boys and Girls",
    "Women Change the World",
    "Understanding Media",
    "Markets Around Us",
    "A Shirt in the Market"
  ],'''

replacements['"CBSE-7-Social Science": ['] = cbse_7_ss + '\n  "CBSE-7-Social Science": ['

# Class 6 CBSE
cbse_6_ss = '''"CBSE-6-History": [
    "What, Where, How and When?",
    "From Hunting–Gathering to Growing Food",
    "In the Earliest Cities",
    "What Books and Burials Tell Us",
    "Kingdoms, Kings and an Early Republic",
    "New Questions and Ideas",
    "Ashoka, The Emperor Who Gave Up War",
    "Vital Villages, Thriving Towns",
    "Traders, Kings and Pilgrims",
    "New Empires and Kingdoms",
    "Buildings, Paintings and Books"
  ],
  "CBSE-6-Geography": [
    "The Earth in the Solar System",
    "Globe: Latitudes and Longitudes",
    "Motions of the Earth",
    "Maps",
    "Major Domains of the Earth",
    "Major Landforms of the Earth",
    "Our Country – India",
    "India: Climate, Vegetation and Wildlife"
  ],
  "CBSE-6-Political Science": [
    "Understanding Diversity",
    "Diversity and Discrimination",
    "What is Government?",
    "Key Elements of a Democratic Government",
    "Panchayati Raj",
    "Rural Administration",
    "Urban Administration",
    "Rural Livelihoods",
    "Urban Livelihoods"
  ],'''

replacements['"CBSE-6-Social Science": ['] = cbse_6_ss + '\n  "CBSE-6-Social Science": ['

# For BSEB, we assume the same structure as CBSE for now (in English since we don't have the Hindi translated ones for 6-8 in the prompt).
# We can just duplicate the lists with BSEB prefix for the system to have valid keys, since the AI handles translation dynamically anyway if needed,
# or we can extract the Hindi ones if they exist. Wait, the original full_syllabus_data has English names for BSEB 6-8 SS! Let's check.
