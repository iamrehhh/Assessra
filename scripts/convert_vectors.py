import json

user_data = {
  "document_title": "Maths 9709 Paper 3 - Vectors",
  "questions": [
    {
      "question_id": "256",
      "paper_reference": "9709_s19_qp_33 Q: 10",
      "context": "The line l has equation $r=i+2j+3k+\\mu(2i-j-2k).$",
      "parts": [
        {
          "label": "(i)",
          "text": "The point P has position vector $4i+2j-3k$. Find the length of the perpendicular from P to l.",
          "marks": "[5]"
        },
        {
          "label": "(ii)",
          "text": "It is given that l lies in the plane with equation $ax+by+2z=13$, where a and b are constants. Find the values of a and b.",
          "marks": "[6]"
        }
      ]
    },
    {
      "question_id": "257",
      "paper_reference": "9709 w19 qp 31 Q:7",
      "context": "Two lines l and m have equations $r=ai+2j+3k+\\lambda(i-2j+3k)$ and $r=2i+j+2k+\\mu(2i-j+k)$ respectively, where a is a constant. It is given that the lines intersect.",
      "parts": [
        {
          "label": "(i)",
          "text": "Find the value of a.",
          "marks": "[4]"
        },
        {
          "label": "(ii)",
          "text": "When a has this value, find the equation of the plane containing l and m.",
          "marks": "[5]"
        }
      ]
    },
    {
      "question_id": "258",
      "paper_reference": "9709_w19_qp_33 Q:7",
      "context": "The plane m has equation $x+4y-8z=2$. The plane n is parallel to m and passes through the point P with coordinates (5, 2, -2).",
      "parts": [
        {
          "label": "(i)",
          "text": "Find the equation of n, giving your answer in the form $ax+by+cz=d$.",
          "marks": "[2]"
        },
        {
          "label": "(ii)",
          "text": "Calculate the perpendicular distance between m and n.",
          "marks": "[3]"
        },
        {
          "label": "(iii)",
          "text": "The line l lies in the plane n, passes through the point P and is perpendicular to OP, where O is the origin. Find a vector equation for l.",
          "marks": "[4]"
        }
      ]
    },
    {
      "question_id": "259",
      "paper_reference": "9709 m18 qp 32 Q: 10",
      "context": "The line l has equation $r=4i+3j-k+\\mu(i+2j-2k).$ The plane p has equation $2x-3y-z=4$.",
      "parts": [
        {
          "label": "(i)",
          "text": "Find the position vector of the point of intersection of l and p.",
          "marks": "[3]"
        },
        {
          "label": "(ii)",
          "text": "Find the acute angle between l and p.",
          "marks": "[3]"
        },
        {
          "label": "(iii)",
          "text": "A second plane q is parallel to l, perpendicular to p and contains the point with position vector 4j-k. Find the equation of q, giving your answer in the form $ax+by+cz=d.$",
          "marks": "[5]"
        }
      ]
    },
    {
      "question_id": "260",
      "paper_reference": "9709 s18 qp 31 Q: 10",
      "context": "The point P has position vector $3i-2j+k$. The line l has equation $r=4i+2j+5k+\\mu(i+2j+3k)$.",
      "parts": [
        {
          "label": "(i)",
          "text": "Find the length of the perpendicular from P to l, giving your answer correct to 3 significant figures.",
          "marks": "[5]"
        },
        {
          "label": "(ii)",
          "text": "Find the equation of the plane containing l and P, giving your answer in the form ax + by + cz = d.",
          "marks": "[5]"
        }
      ]
    },
    {
      "question_id": "261",
      "paper_reference": "9709 s18 qp 32 Q: 10",
      "context": "Two lines l and m have equations $r=2i-j+k+s(2i+3j-k)$ and $r=i+3j+4k+t(i+2j+k)$ respectively. A plane p is parallel to the lines l and m.",
      "parts": [
        {
          "label": "(i)",
          "text": "Show that the lines are skew.",
          "marks": "[4]"
        },
        {
          "label": "(ii)",
          "text": "Find a vector that is normal to p.",
          "marks": "[3]"
        },
        {
          "label": "(iii)",
          "text": "Given that p is equidistant from the lines l and m, find the equation of p. Give your answer in the form $ax+by+cz=d$.",
          "marks": "[3]"
        }
      ]
    },
    {
      "question_id": "262",
      "paper_reference": "9709_s18_qp_33 Q: 10",
      "context": "The points A and B have position vectors $2i+j+3k$ and $4i+j+k$ respectively. The line l has equation $r=4i+6j+\\mu(i+2j-2k).$",
      "parts": [
        {
          "label": "(i)",
          "text": "Show that l does not intersect the line passing through A and B.",
          "marks": "[5]"
        },
        {
          "label": "(ii)",
          "text": "The point P, with parameter t, lies on l and is such that angle PAB is equal to 120°. Show that $3t^{2}+8t+4=0.$ Hence find the position vector of P.",
          "marks": "[6]"
        }
      ]
    },
    {
      "question_id": "263",
      "paper_reference": "9709 w18 qp 31 Q: 10",
      "context": "The planes m and n have equations $3x+y-2z=10$ and $x-2y+2z=5$ respectively. The line l has equation $r=4i+2j+k+\\lambda(i+j+2k).$",
      "parts": [
        {
          "label": "(i)",
          "text": "Show that l is parallel to m.",
          "marks": "[3]"
        },
        {
          "label": "(ii)",
          "text": "Calculate the acute angle between the planes m and n.",
          "marks": "[3]"
        },
        {
          "label": "(iii)",
          "text": "A point P lies on the line l. The perpendicular distance of P from the plane n is equal to 2. Find the position vectors of the two possible positions of P.",
          "marks": "[4]"
        }
      ]
    },
    {
      "question_id": "264",
      "paper_reference": "9709 w18 qp 32 Q: 10",
      "context": "The line l has equation $r=5i-3j-k+\\lambda(i-2j+k).$ The plane p has equation $(r-i-2j).(3i+j+k)=0$. The line l intersects the plane p at the point A.",
      "parts": [
        {
          "label": "(i)",
          "text": "Find the position vector of A.",
          "marks": "[3]"
        },
        {
          "label": "(ii)",
          "text": "Calculate the acute angle between l and p.",
          "marks": "[4]"
        },
        {
          "label": "(iii)",
          "text": "Find the equation of the line which lies in p and intersects l at right angles.",
          "marks": "[4]"
        }
      ]
    },
    {
      "question_id": "265",
      "paper_reference": "9709_m17_qp_32 Q:6",
      "context": "The line l has equation $r=i+2j-3k+\\lambda(2i-j+k)$. The plane p has equation $3x+y-5z=20$",
      "parts": [
        {
          "label": "(i)",
          "text": "Show that the line l lies in the plane p.",
          "marks": "[3]"
        },
        {
          "label": "(ii)",
          "text": "A second plane is parallel to l, perpendicular to p and contains the point with position vector $3i-j+2k$. Find the equation of this plane, giving your answer in the form $ax+by+cz=d.$",
          "marks": "[5]"
        }
      ]
    },
    {
      "question_id": "266",
      "paper_reference": "9709_s17_qp_31 Q: 6",
      "context": "The plane with equation $2x+2y-z=5$ is denoted by m. Relative to the origin O, the points A and B have coordinates (3, 4, 0) and (-1,0,2) respectively.",
      "parts": [
        {
          "label": "(i)",
          "text": "Show that the plane m bisects AB at right angles.",
          "marks": "[5]"
        },
        {
          "label": "(ii)",
          "text": "A second plane p is parallel to m and nearer to O. The perpendicular distance between the planes is 1. Find the equation of p, giving your answer in the form $ax+by+cz=d.$",
          "marks": "[3]"
        }
      ]
    },
    {
      "question_id": "267",
      "paper_reference": "9709 s17 qp 32 Q: 9",
      "context": "Relative to the origin O, the point A has position vector given by $\\vec{OA}=i+2j+4k.$ The line l has equation $r=9i-j+8k+\\mu(3i-j+2k).$",
      "parts": [
        {
          "label": "(i)",
          "text": "Find the position vector of the foot of the perpendicular from A to l. Hence find the position vector of the reflection of A in l.",
          "marks": "[5]"
        },
        {
          "label": "(ii)",
          "text": "Find the equation of the plane through the origin which contains l. Give your answer in the form $ax+by+cz=d.$",
          "marks": "[3]"
        },
        {
          "label": "(iii)",
          "text": "Find the exact value of the perpendicular distance of A from this plane.",
          "marks": "[3]"
        }
      ]
    },
    {
      "question_id": "268",
      "paper_reference": "9709 s17 qp 33 Q: 10",
      "context": "The points A and B have position vectors given by $\\vec{OA}=i-2j+2k$ and $\\vec{OB}=3i+j+k$. The line l has equation $r=2i+j+mk+\\mu(i-2j-4k),$ where m is a constant.",
      "parts": [
        {
          "label": "(i)",
          "text": "Given that the line l intersects the line passing through A and B, find the value of m.",
          "marks": "[5]"
        },
        {
          "label": "(ii)",
          "text": "Find the equation of the plane which is parallel to i-2j-4k and contains the points A and B. Give your answer in the form $ax+by+cz=d.$",
          "marks": "[5]"
        }
      ]
    },
    {
      "question_id": "269",
      "paper_reference": "9709 w17_qp_31 Q: 10",
      "context": "The equations of two lines l and m are $r=3i-j-2k+\\lambda(-i+j+4k)$ and $r=4i+4j-3k+\\mu(2i+j-2k)$ respectively.",
      "parts": [
        {
          "label": "(i)",
          "text": "Show that the lines do not intersect.",
          "marks": "[3]"
        },
        {
          "label": "(ii)",
          "text": "Calculate the acute angle between the directions of the lines.",
          "marks": "[3]"
        },
        {
          "label": "(iii)",
          "text": "Find the equation of the plane which passes through the point $(3,-2,-1)$ and which is parallel to both l and m. Give your answer in the form $ax+by+cz=d.$",
          "marks": "[5]"
        }
      ]
    },
    {
      "question_id": "270",
      "paper_reference": "9709 w17_qp_32 Q: 10",
      "context": "Two planes p and q have equations $x+y+3z=8$ and $2x-2y+z=3$ respectively.",
      "parts": [
        {
          "label": "(i)",
          "text": "Calculate the acute angle between the planes p and q.",
          "marks": "[4]"
        },
        {
          "label": "(ii)",
          "text": "The point A on the line of intersection of p and q has y-coordinate equal to 2. Find the equation of the plane which contains the point A and is perpendicular to both the planes p and q. Give your answer in the form $ax+by+cz=d$.",
          "marks": "[7]"
        }
      ]
    },
    {
      "question_id": "271",
      "paper_reference": "9709 m16 qp 32 Q: 8",
      "context": "The line l has equation $r=\\left(\\begin{matrix}1\\\\ 2\\\\ -1\\end{matrix}\\right)+\\lambda\\left(\\begin{matrix}2\\\\ 1\\\\ 3\\end{matrix}\\right).$ The plane p has equation $r\\cdot\\left(\\begin{matrix}2\\\\ -1\\\\ -1\\end{matrix}\\right)=6.$",
      "parts": [
        {
          "label": "(i)",
          "text": "Show that l is parallel to p.",
          "marks": "[3]"
        },
        {
          "label": "(ii)",
          "text": "A line m lies in the plane p and is perpendicular to l. The line m passes through the point with coordinates (5, 3, 1). Find a vector equation for m.",
          "marks": "[6]"
        }
      ]
    },
    {
      "question_id": "272",
      "paper_reference": "9709 s16_qp 31 Q:9",
      "context": "With respect to the origin O, the points A, B, C, D have position vectors given by $\\vec{OA}=i+3j+2k$, $\\vec{OB}=2i+j-k,$ $\\vec{OC}=2i+4j+k,$ $\\vec{OD}=-3i+j+2k.$",
      "parts": [
        {
          "label": "(i)",
          "text": "Find the equation of the plane containing A, B and C, giving your answer in the form $ax+by+cz=d$",
          "marks": "[6]"
        },
        {
          "label": "(ii)",
          "text": "The line through D parallel to OA meets the plane with equation $x+2y-z=7$ at the point P. Find the position vector of P and show that the length of DP is $2\\sqrt{14}$.",
          "marks": "[5]"
        }
      ]
    },
    {
      "question_id": "273",
      "paper_reference": "9709 s16 qp 32 Q: 9",
      "context": "The points A, B and C have position vectors, relative to the origin O, given by $\\vec{OA}=i+2j+3k,$ $\\vec{OB}=4j+k$ and $\\vec{OC}=2i+5j-k$ A fourth point D is such that the quadrilateral ABCD is a parallelogram.",
      "parts": [
        {
          "label": "(i)",
          "text": "Find the position vector of D and verify that the parallelogram is a rhombus.",
          "marks": "[5]"
        },
        {
          "label": "(ii)",
          "text": "The plane p is parallel to OA and the line BC lies in p. Find the equation of p, giving your answer in the form $ax+by+cz=d$",
          "marks": "[5]"
        }
      ]
    },
    {
      "question_id": "274",
      "paper_reference": "9709_s16_qp 33 Q: 8",
      "context": "The points A and B have position vectors, relative to the origin $O,$ given by $\\vec{OA}=i+j+k$ and $\\vec{OB}=2i+3k.$ The line l has vector equation $r=2i-2j-k+\\mu(-i+2j+k)$.",
      "parts": [
        {
          "label": "(i)",
          "text": "Show that the line passing through A and B does not intersect l.",
          "marks": "[4]"
        },
        {
          "label": "(ii)",
          "text": "Show that the length of the perpendicular from A to l is $\\frac{1}{\\sqrt{2}}$",
          "marks": "[5]"
        }
      ]
    },
    {
      "question_id": "275",
      "paper_reference": "9709 w16 qp 31 Q: 8",
      "context": "Two planes have equations $3x+y-z=2$ and $x-y+2z=3.$",
      "parts": [
        {
          "label": "(i)",
          "text": "Show that the planes are perpendicular.",
          "marks": "[3]"
        },
        {
          "label": "(ii)",
          "text": "Find a vector equation for the line of intersection of the two planes.",
          "marks": "[6]"
        }
      ]
    },
    {
      "question_id": "276",
      "paper_reference": "9709 w16 qp 33 Q: 10",
      "context": "The line l has vector equation $r=i+2j+k+\\lambda(2i-j+k).$",
      "parts": [
        {
          "label": "(i)",
          "text": "Find the position vectors of the two points on the line whose distance from the origin is $\\sqrt{10}.$",
          "marks": "[5]"
        },
        {
          "label": "(ii)",
          "text": "The plane p has equation $ax+y+z=5$ where a is a constant. The acute angle between the line l and the plane p is equal to $\\sin^{-1}(\\frac{2}{3})$. Find the possible values of a.",
          "marks": "[5]"
        }
      ]
    },
    {
      "question_id": "277",
      "paper_reference": "9709 s15 qp 31 Q: 6",
      "context": "The straight line $l_{1}$ passes through the points (0, 1, 5) and (2, -2, 1). The straight line $l_{2}$ has equation $r=7i+j+k+\\mu(i+2j+5k)$.",
      "parts": [
        {
          "label": "(i)",
          "text": "Show that the lines $l_{1}$ and $l_{2}$ are skew.",
          "marks": "[6]"
        },
        {
          "label": "(ii)",
          "text": "Find the acute angle between the direction of the line $l_{2}$ and the direction of the x-axis.",
          "marks": "[3]"
        }
      ]
    },
    {
      "question_id": "278",
      "paper_reference": "9709_s15_qp_32 Q: 10",
      "context": "The points A and B have position vectors given by $\\vec{OA}=2i-j+3k$ and $\\vec{OB}=i+j+5k$ The line l has equation $r=i+j+2k+\\mu(3i+j-k)$",
      "parts": [
        {
          "label": "(i)",
          "text": "Show that l does not intersect the line passing through A and B.",
          "marks": "[5]"
        },
        {
          "label": "(ii)",
          "text": "Find the equation of the plane containing the line l and the point A. Give your answer in the form $ax+by+cz=d$",
          "marks": "[6]"
        }
      ]
    },
    {
      "question_id": "279",
      "paper_reference": "9709 s15 qp 33 Q: 9",
      "context": "Two planes have equations $x+3y-2z=4$ and $2x+y+3z=5$ The planes intersect in the straight line l.",
      "parts": [
        {
          "label": "(i)",
          "text": "Calculate the acute angle between the two planes.",
          "marks": "[4]"
        },
        {
          "label": "(ii)",
          "text": "Find a vector equation for the line l.",
          "marks": "[6]"
        }
      ]
    },
    {
      "question_id": "280",
      "paper_reference": "9709 w15_qp_31 Q:7",
      "context": "The points A, B and C have position vectors, relative to the origin O, given by $\\vec{OA}=\\left(\\begin{matrix}1\\\\ 2\\\\ 0\\end{matrix}\\right)$ , $\\vec{OB}=\\left(\\begin{matrix}3\\\\ 0\\\\ 1\\end{matrix}\\right)$ and $\\vec{OC}=\\left(\\begin{matrix}1\\\\ 1\\\\ 4\\end{matrix}\\right).$ The plane m is perpendicular to AB and contains the point C.",
      "parts": [
        {
          "label": "(i)",
          "text": "Find a vector equation for the line passing through A and B.",
          "marks": "[2]"
        },
        {
          "label": "(ii)",
          "text": "Obtain the equation of the plane m, giving your answer in the form $ax+by+cz=d$.",
          "marks": "[2]"
        },
        {
          "label": "(iii)",
          "text": "The line through A and B intersects the plane m at the point N. Find the position vector of N and show that $CN=\\sqrt{13}$",
          "marks": "[5]"
        }
      ]
    },
    {
      "question_id": "281",
      "paper_reference": "9709 w15_qp_33 Q: 8",
      "context": "A plane has equation $4x-y+5z=39$ A straight line is parallel to the vector $i-3j+4k$ and passes through the point $A(0,2,-8)$ The line meets the plane at the point B.",
      "parts": [
        {
          "label": "(i)",
          "text": "Find the coordinates of B.",
          "marks": "[3]"
        },
        {
          "label": "(ii)",
          "text": "Find the acute angle between the line and the plane.",
          "marks": "[4]"
        },
        {
          "label": "(iii)",
          "text": "The point C lies on the line and is such that the distance between C and B is twice the distance between A and B. Find the coordinates of each of the possible positions of the point C.",
          "marks": "[3]"
        }
      ]
    }
  ]
}

formatted_questions = []

for q in user_data["questions"]:
    # Format the entire question HTML
    # Context
    full_text = f"{q.get('context', '')}<br><br>"
    
    total_marks = 0
    
    # Parts
    for p in q["parts"]:
        # Remove [ and ] from marks
        m_str = p.get('marks', '[0]').replace('[', '').replace(']', '').strip()
        try:
            m_val = int(m_str)
            total_marks += m_val
        except:
            pass # keep existing if error
            
        full_text += f"<b>{p['label']}</b> {p['text']} <i>({m_str} marks)</i><br><br>"

    js_obj = {
        "id": f"vec_{q['question_id']}",
        "topic": "vectors",
        "question": full_text.strip().replace('"', '\\"'), # simple escape
        "image": "",
        "marks": total_marks,
        "marking_scheme": "" # Empty for AI
    }
    formatted_questions.append(js_obj)

# Create the JS code content
js_content = "[\n"
for fq in formatted_questions:
    js_content += '    {\n'
    js_content += f'        id: "{fq["id"]}",\n'
    js_content += f'        topic: "{fq["topic"]}",\n'
    js_content += f'        question: "{fq["question"]}",\n'
    js_content += f'        image: "{fq["image"]}",\n'
    js_content += f'        marks: {fq["marks"]},\n'
    js_content += f'        marking_scheme: "{fq["marking_scheme"]}"\n'
    js_content += '    },\n'
js_content += "];"

print(js_content)
