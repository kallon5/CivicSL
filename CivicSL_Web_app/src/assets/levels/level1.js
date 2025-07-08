import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";
import { useState } from "react";

const levelOneContent = [
  {
    id: 1,
    title: "1.1 What is Civic Education?",
    summary:
      "Civic education is the study of the rights and responsibilities of citizens and the workings of government and society.",
    fullText:
      "Civic education helps individuals understand their rights, responsibilities, and how they can actively participate in shaping their communities and governance systems. In Sierra Leone, it plays a key role in peacebuilding and fostering democratic values.",
    videoUrl: "https://www.youtube.com/embed/sample1",
  },
  {
    id: 2,
    title: "1.2 Why Civic Education is Important in Sierra Leone",
    summary: "It promotes unity, democracy, peace, and national development.",
    fullText:
      "In Sierra Leone, civic education builds peace and unity, encourages democratic participation, and contributes to national development. It helps citizens understand their power and responsibilities in governance and decision-making.",
    videoUrl: "https://www.youtube.com/embed/sample2",
  },
  {
    id: 3,
    title: "1.3 Values of Democracy and Good Citizenship",
    summary:
      "Explores key democratic values and what it means to be a responsible citizen.",
    fullText:
      "Democratic values include rule of law, justice, equality, freedom, and tolerance. Good citizens obey the law, vote, respect others, and contribute to community development.",
    videoUrl: "https://www.youtube.com/embed/sample3",
  },
  {
    id: 4,
    title: "1.4 The Role of the Individual in Society",
    summary: "How individuals can contribute positively to their society.",
    fullText:
      "Each person has a role in building society: obeying laws, paying taxes, volunteering, voting, and speaking out. Active citizens shape their communities and governments.",
    videoUrl: "https://www.youtube.com/embed/sample4",
  },
];

export default function LevelOneOutline() {
  const [expandedId, setExpandedId] = useState(null);
  const [viewedLessons, setViewedLessons] = useState([]);

  const toggleCard = (id) => {
    setExpandedId(expandedId === id ? null : id);
    if (!viewedLessons.includes(id)) {
      setViewedLessons([...viewedLessons, id]);
    }
  };

  const allLessonsViewed = viewedLessons.length === levelOneContent.length;

  return (
    <div className="grid gap-4 max-w-3xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-2">
        📘 Level 1: Introduction to Civic Education
      </h1>
      {levelOneContent.map((lesson) => (
        <Card
          key={lesson.id}
          className="cursor-pointer hover:shadow-lg transition"
          onClick={() => toggleCard(lesson.id)}
        >
          <CardContent className="p-4">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-semibold">{lesson.title}</h2>
              <ChevronRight
                className={`transform transition-transform ${
                  expandedId === lesson.id ? "rotate-90" : ""
                }`}
              />
            </div>
            <p className="text-sm text-gray-600 mt-1">{lesson.summary}</p>
            {expandedId === lesson.id && (
              <div className="mt-3 text-gray-800 space-y-4">
                <div className="aspect-w-16 aspect-h-9">
                  <iframe
                    className="w-full h-64 rounded-lg"
                    src={lesson.videoUrl}
                    title="Lesson Video"
                    allowFullScreen
                  ></iframe>
                </div>
                <p>{lesson.fullText}</p>
                <div>
                  <Button variant="outline">📄 Download Handout</Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      ))}
      {allLessonsViewed && (
        <div className="text-center mt-6">
          <Button className="text-lg">📝 Take Quiz for Level 1</Button>
        </div>
      )}
    </div>
  );
}
