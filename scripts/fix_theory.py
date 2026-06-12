import json
import re

with open('data/notes/A Level/Business/theory.json', 'r') as f:
    data = json.load(f)

# Hardcoded true titles based on the content
# We will match the beginning of the combined text to extract the correct title and the remaining as content.
chapter_titles = [
    "1.1. Political and Legal",
    "1.2. Economic",
    "1.3. Social and Demographic",
    "1.4. Technological",
    "1.5. Competitors and suppliers",
    "1.6. International",
    "1.7. Environmental",
    "2.1. Developing Business Strategy",
    "2.2. Corporate Planning and Implementation",
    "3.1. The relationship between Business objectives and Organisation",
    "3.2. Types of structure",
    "3.3. Delegation and Accountability",
    "3.4. Control, Authority and Trust",
    "3.5. Centralization & Decentralization",
    "3.6. Line & Staff",
    "4.1. The Qualities of Successful Leaders and Positions",
    "4.2. What is a Informal Leader?",
    "4.3. Theories of Leadership",
    "4.4. Emotional Intelligence (El)",
    "5.1. Soft and Hard HRM",
    "5.2. Types of Employment and Flexible Workforce",
    "5.3. Labor Productivity, Absenteeism, and Measurement of Employee's",
    "5.4. What happens due to subpar employee's performance?",
    "5.5. Management By Objectives (MBO)",
    "5.6. Uses of IT and AI in HRM",
    "6.1. Elasticity",
    "6.2. Product development",
    "6.3. Sales forecasting",
    "7.1. Planning the Marketing Strategy",
    "7.2. Approaches to marketing strategy",
    "7.3. Strategies for international marketing",
    "8.1. Location",
    "8.2. Scale of operations",
    "9.1. Quality Control and Quality Assurance",
    "9.2. Benchmarking",
    "0.1. Operational Decisions",
    "0.2. Flexibility & Innovation",
    "0.3. Enterprise Resource Planning (ERP)",
    "0.4. Lean Production",
    "0.5. Operations Planning",
    "1.1. Introduction",
    "1.2. Statement of profit or loss",
    "1.3. The Statement of Financial position",
    "1.4. Inventory valuation",
    "1.5. Depreciation",
    "2.1. Introduction",
    "2.2. Liquidity ratios",
    "2.3. Profitability ratios",
    "2.4. Financial efficiency ratios",
    "2.5. Gearing ratio",
    "2.6. Investment ratios",
    "3.1. The concept of investment appraisal",
    "3.2. Basic methods: Payback, Accounting Rate of Return (ARR)",
    "3.3. Discounted cash flow method: Net Present Value (NPV)",
    "3.4. Investment Appraisal Decisions",
    "4.1. The use of Accounting data to enable Strategic decision making",
    "4.2. The use of Accounting data and Ratio analysis in Strategic decision making",
    "5.1. Purposes of Communication",
    "5.2. Methods of communication",
    "5.3. Channels of Communication",
    "5.4. Communication Barrier: Reasons why communication can fail."
]

new_data = []

# Sorting titles by length descending so that we match the longest possible prefix
chapter_titles.sort(key=len, reverse=True)

for section in data:
    combined = section['title'] + " " + section['content']
    # Replace any weird formatting from parse_pdfs
    combined = combined.replace("  ", " ").strip()
    
    # Find the title
    matched_title = None
    for ct in chapter_titles:
        if combined.startswith(ct):
            matched_title = ct
            break
            
    if not matched_title:
        # Fallback regex if it's not in the hardcoded list
        match = re.match(r'^(\d+\.\d+\.\s+[^.?!:]+)', combined)
        if match:
            matched_title = match.group(1).strip()
        else:
            matched_title = section['title'] # fallback
            
    content = combined[len(matched_title):].strip()
    
    new_data.append({
        "title": matched_title,
        "content": content
    })

with open('data/notes/A Level/Business/theory.json', 'w') as f:
    json.dump(new_data, f, indent=2)

print("theory.json fixed")
