import { useState } from "react";

const initialForm = {
  understanding: "",
  pace: "",
  askQuestions: "",
  confidence: "",
  motivation: "",
  preferredLearning: "",
  biggestDifficulty: "",
  practiceBarrier: "",
  teacherChange: "",
  additionalFeedback: "",
};

// Available choices for the two rating questions
const ratingOptions = [
  { value: "1", label: "1 — Not at all" },
  { value: "2", label: "2 — A little" },
  { value: "3", label: "3 — Somewhat" },
  { value: "4", label: "4 — Quite a lot" },
  { value: "5", label: "5 — Very much" },
];

const initialRatings = {
  lessonClarity: "",
  classSupport: "",
};

const questions = [
  {
    key: "understanding",
    title: "1. How well do you understand the lessons?",
    options: [
      "I understand most things",
      "I understand some things",
      "I often feel confused",
      "I need more individual help",
    ],
  },
  {
    key: "pace",
    title: "2. How does the speed of the lessons feel?",
    options: ["Too slow", "About right", "A little too fast", "Much too fast"],
  },
  {
    key: "askQuestions",
    title: "3. How comfortable are you asking questions in class?",
    options: [
      "Very comfortable",
      "Somewhat comfortable",
      "I feel shy or nervous",
      "I usually avoid asking questions",
    ],
  },
  {
    key: "confidence",
    title: "4. How confident are you when solving coding tasks alone?",
    options: [
      "Very confident",
      "Somewhat confident",
      "I need help often",
      "I usually don't know where to start",
    ],
  },
  {
    key: "motivation",
    title: "5. How interested are you in learning web development?",
    options: [
      "Very interested",
      "Somewhat interested",
      "Not sure yet",
      "Not very interested right now",
    ],
  },
  {
    key: "preferredLearning",
    title: "6. What helps you learn best?",
    options: [
      "Teacher explanations and examples",
      "Solving practical tasks myself",
      "Building real-world projects",
      "Working with a classmate",
      "Step-by-step written instructions",
    ],
  },
  {
    key: "biggestDifficulty",
    title: "7. What is your biggest learning difficulty?",
    options: [
      "Understanding new concepts",
      "Remembering what I learned",
      "Writing code without copying",
      "Finding and fixing errors",
      "Keeping up with the lesson",
      "I don't currently have a major difficulty",
    ],
  },
  {
    key: "practiceBarrier",
    title: "8. What makes practising outside class difficult?",
    options: [
      "I don't have enough time",
      "I don't always have access to a computer",
      "I don't know what to practise",
      "I struggle to solve tasks alone",
      "I find it difficult to stay motivated",
      "Nothing prevents me from practising",
      "I prefer not to say",
    ],
  },
];

function Question({ question, value, onChange }) {
  return (
    <fieldset className="space-y-3">
      <legend className="mb-3 text-sm font-semibold leading-6 text-slate-800 sm:text-base">
        {question.title}
      </legend>

      <div className="grid gap-2">
        {question.options.map((option) => (
          <label
            key={option}
            className={`flex cursor-pointer items-start gap-3 rounded-xl border p-3 text-sm transition ${
              value === option
                ? "border-teal-600 bg-teal-50 text-teal-950"
                : "border-slate-200 bg-white hover:border-teal-300"
            }`}
          >
            <input
              type="radio"
              name={question.key}
              value={option}
              checked={value === option}
              onChange={() => onChange(question.key, option)}
              className="mt-0.5 accent-teal-700"
              required
            />

            <span>{option}</span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}

function RatingQuestion({ name, title, value, onChange }) {
  return (
    <fieldset className="space-y-3">
      <legend className="text-sm font-semibold leading-6 text-slate-800">
        {title}
      </legend>

      {ratingOptions.map((rating) => (
        <label
          key={rating.value}
          className={`flex cursor-pointer items-center gap-3 rounded-xl border p-3 text-sm transition ${
            value === rating.value
              ? "border-teal-600 bg-teal-50 text-teal-950"
              : "border-slate-200 hover:border-teal-300"
          }`}
        >
          <input
            type="radio"
            name={name}
            value={rating.value}
            checked={value === rating.value}
            onChange={() => onChange(name, rating.value)}
            className="accent-teal-700"
            required
          />

          {rating.label}
        </label>
      ))}
    </fieldset>
  );
}

export default function App() {
  const [form, setForm] = useState(initialForm);
  const [ratings, setRatings] = useState(initialRatings);
  const [status, setStatus] = useState("idle");

  function updateField(name, value) {
    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  }

  function updateRating(name, value) {
    setRatings((previous) => ({
      ...previous,
      [name]: value,
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (status === "sending") return;

    setStatus("sending");

    const payload = {
      ...form,
      ...ratings,
      submittedAt: new Date().toISOString(),
    };

    try {
      const response = await fetch(
        "https://script.google.com/macros/s/AKfycbxBgxckh6_I0nfy4UAAuE9Gd3c5i5x1xnCXQMWmD2ocIvdLLm1VCDxrytz6Zq_BvS0z/exec",
        {
          method: "POST",
          headers: {
            "Content-Type": "text/plain;charset=utf-8",
          },
          body: JSON.stringify(payload),
        },
      );

      if (!response.ok) {
        throw new Error(`Request failed: ${response.status}`);
      }

      setForm({ ...initialForm });
      setRatings({ ...initialRatings });
      setStatus("success");
    } catch (error) {
      console.error("Submission error:", error);
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-950 px-4 py-12">
        <div className="w-full max-w-lg rounded-3xl border border-white/10 bg-white p-8 text-center shadow-2xl sm:p-12">
          <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-teal-100 text-3xl text-teal-700">
            ✓
          </div>

          <h1 className="text-2xl font-bold text-slate-900">
            Thank you for sharing!
          </h1>

          <p className="mt-3 leading-7 text-slate-600">
            Your feedback matters. It will help us understand how to make our
            lessons more useful, comfortable, and practical.
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-10 sm:px-6 sm:py-16">
      <div className="mx-auto max-w-3xl">
        <header className="mb-8 text-center sm:mb-10">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-teal-400/20 bg-teal-400/10 px-4 py-2 text-xs font-semibold uppercase tracking-widest text-teal-300">
            <span className="h-2 w-2 rounded-full bg-teal-400" />
            Your voice matters
          </div>

          <h1 className="text-3xl font-bold tracking-tight text-white sm:text-5xl">
            Help me make learning
            <span className="block text-teal-400">better for you.</span>
          </h1>

          <p className="mx-auto mt-5 max-w-xl text-sm leading-7 text-slate-300 sm:text-base">
            This short survey helps me understand your learning experience,
            challenges, and preferences. Honest answers help me improve our
            classes.
          </p>
        </header>

        <div className="mb-6 rounded-2xl border border-teal-400/20 bg-teal-400/5 p-4 text-sm leading-6 text-slate-200">
          <strong className="text-teal-300">Your privacy:</strong> This survey
          does not ask for your name or email address. Please avoid including
          identifying or highly personal information in written answers. Your
          feedback will be used to improve teaching.
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-7 rounded-3xl border border-white/10 bg-white p-5 shadow-2xl sm:p-9"
        >
          <div className="border-b border-slate-200 pb-5">
            <p className="text-xs font-bold uppercase tracking-widest text-teal-700">
              Section 01
            </p>

            <h2 className="mt-2 text-xl font-bold text-slate-900">
              Your learning experience
            </h2>

            <p className="mt-2 text-sm leading-6 text-slate-500">
              Choose the answer that best describes your experience.
            </p>
          </div>

          {questions.slice(0, 4).map((question) => (
            <Question
              key={question.key}
              question={question}
              value={form[question.key]}
              onChange={updateField}
            />
          ))}

          <div className="border-t border-slate-200 pt-6">
            <p className="text-xs font-bold uppercase tracking-widest text-teal-700">
              Section 02
            </p>

            <h2 className="mt-2 text-xl font-bold text-slate-900">
              Your motivation and challenges
            </h2>
          </div>

          {questions.slice(4).map((question) => (
            <Question
              key={question.key}
              question={question}
              value={form[question.key]}
              onChange={updateField}
            />
          ))}

          <div className="border-t border-slate-200 pt-6">
            <p className="text-xs font-bold uppercase tracking-widest text-teal-700">
              Section 03
            </p>

            <h2 className="mt-2 text-xl font-bold text-slate-900">
              A little more about your experience
            </h2>
          </div>

          <RatingQuestion
            name="lessonClarity"
            title="9. How clear are the teacher's explanations?"
            value={ratings.lessonClarity}
            onChange={updateRating}
          />

          <RatingQuestion
            name="classSupport"
            title="10. How supported do you feel when you get stuck?"
            value={ratings.classSupport}
            onChange={updateRating}
          />

          <div className="space-y-2">
            <label
              htmlFor="teacherChange"
              className="block text-sm font-semibold text-slate-800"
            >
              11. What is one thing your teacher could change to help you learn
              better?
            </label>

            <textarea
              id="teacherChange"
              rows={3}
              maxLength={1000}
              value={form.teacherChange}
              onChange={(e) => updateField("teacherChange", e.target.value)}
              placeholder="Share an honest suggestion..."
              className="w-full rounded-xl border border-slate-200 p-4 text-sm outline-none transition placeholder:text-slate-400 focus:border-teal-600 focus:ring-4 focus:ring-teal-600/10"
            />
          </div>

          <div className="space-y-2">
            <label
              htmlFor="additionalFeedback"
              className="block text-sm font-semibold text-slate-800"
            >
              12. Is there anything else you want your teacher to understand?
              <span className="ml-2 font-normal text-slate-400">Optional</span>
            </label>

            <textarea
              id="additionalFeedback"
              rows={4}
              maxLength={1500}
              value={form.additionalFeedback}
              onChange={(e) =>
                updateField("additionalFeedback", e.target.value)
              }
              placeholder="Anything about the lessons, your learning needs, or your goals..."
              className="w-full rounded-xl border border-slate-200 p-4 text-sm outline-none transition placeholder:text-slate-400 focus:border-teal-600 focus:ring-4 focus:ring-teal-600/10"
            />
          </div>

          {status === "error" && (
            <p
              role="alert"
              className="rounded-xl bg-red-50 p-4 text-sm text-red-700"
            >
              We couldn't confirm your submission. Please check your connection
              and try again. If the problem continues, contact your teacher.
            </p>
          )}

          <button
            type="submit"
            disabled={status === "sending"}
            className="w-full rounded-xl bg-teal-700 px-6 py-4 font-semibold text-white shadow-lg shadow-teal-700/20 transition hover:bg-teal-800 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {status === "sending" ? "Submitting..." : "Submit my feedback"}
          </button>

          <p className="text-center text-xs leading-5 text-slate-400">
            Thank you for helping improve our learning experience.
          </p>
        </form>

        <footer className="mt-6 text-center text-xs text-slate-500">
          Student Learning Feedback · Web Development
        </footer>
      </div>
    </main>
  );
}
