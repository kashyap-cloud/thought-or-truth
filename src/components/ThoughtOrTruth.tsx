import { useState } from "react";
import { useTranslation } from "react-i18next";
import PhoneFrame from "./PhoneFrame";
import ProgressBar from "./ProgressBar";
import Hearts from "./Hearts";
import SwipeCard from "./SwipeCard";
import { LanguageSwitcher } from "./LanguageSwitcher";

type Screen = "welcome" | "before" | "quiz" | "results";

const ThoughtOrTruth = () => {
  const { t } = useTranslation();
  const [screen, setScreen] = useState<Screen>("welcome");
  const [questionIdx, setQuestionIdx] = useState(0);
  const [hearts, setHearts] = useState(3);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState<null | { correct: boolean; title: string; body: string }>(null);
  const [screenKey, setScreenKey] = useState(0);

  // Parse questions directly from translations
  const QUESTIONS = t("questions", { returnObjects: true }) as Array<{
    q: string;
    correctExplain: string;
    wrongExplain: string;
  }>;
  
  // Need to merge answers and gradients from code since they are not in translations
  const quizData = QUESTIONS.map((q, i) => {
    // Determine truthy/gradient logically or by index
    // Assuming original order: false, true, true, false, false
    const answers = [false, true, true, false, false];
    const gradients = [
      "linear-gradient(135deg, #FF6B9D, #FF8C69)",
      "linear-gradient(135deg, #A855F7, #7C3AED)",
      "linear-gradient(135deg, #06B6D4, #3B82F6)",
      "linear-gradient(135deg, #F59E0B, #EF4444)",
      "linear-gradient(135deg, #22C55E, #06B6D4)",
    ];
    return {
      ...q,
      answer: answers[i],
      gradient: gradients[i]
    };
  });

  const progress = screen === "welcome" ? 0 : screen === "before" ? 10 : screen === "quiz" ? 10 + (questionIdx / 5) * 80 : 100;

  const goTo = (s: Screen) => {
    setScreenKey((k) => k + 1);
    setScreen(s);
  };

  const handleSwipe = (dir: "left" | "right") => {
    const q = quizData[questionIdx];
    const userAnswer = dir === "right";
    const correct = userAnswer === q.answer;
    if (correct) {
      setScore((s) => s + 1);
      setFeedback({ correct: true, title: t("quiz.correct"), body: q.correctExplain });
    } else {
      setHearts((h) => Math.max(0, h - 1));
      setFeedback({ correct: false, title: t("quiz.incorrect"), body: q.wrongExplain });
    }
  };

  const handleContinue = () => {
    setFeedback(null);
    if (questionIdx < 4) {
      setQuestionIdx((i) => i + 1);
    } else {
      goTo("results");
    }
  };

  const restart = () => {
    setQuestionIdx(0);
    setHearts(3);
    setScore(0);
    setFeedback(null);
    goTo("welcome");
  };

  return (
    <div className="min-h-screen bg-[#F5EEFF] flex items-center justify-center p-4">
      <LanguageSwitcher />
      <PhoneFrame>
        <div key={screenKey} className="animate-screen-enter" style={{ padding: '20px 20px 24px', display: 'flex', flexDirection: 'column', height: '100%', minHeight: 640 }}>
          {/* Header */}
          <div style={{ display: 'flex', alignItems: 'center', justifyItems: 'space-between', justifyContent: 'space-between', marginBottom: 16 }}>
            <div style={{ width: 36 }}>
              {screen === "welcome" && (
                <button style={{ width: 32, height: 32, borderRadius: 10, background: '#F5EEFF', color: '#9B6BD4', fontWeight: 900, fontSize: 18, border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  ‹
                </button>
              )}
              {screen !== "welcome" && screen !== "results" && (
                <button onClick={() => goTo("welcome")} style={{ width: 32, height: 32, borderRadius: 10, background: '#F5EEFF', color: '#9B6BD4', fontWeight: 900, fontSize: 16, border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  ✕
                </button>
              )}
            </div>
            <div style={{ flex: 1, margin: '0 12px' }}>
              <ProgressBar percent={progress} />
            </div>
            <Hearts count={hearts} />
          </div>

          {/* Screen Content */}
          {screen === "welcome" && <WelcomeScreen onStart={() => goTo("before")} t={t} />}
          {screen === "before" && <BeforeScreen onContinue={() => goTo("quiz")} t={t} />}
          {screen === "quiz" && (
            <QuizScreen
              questionIdx={questionIdx}
              q={quizData[questionIdx]}
              feedback={feedback}
              onSwipe={handleSwipe}
              onContinue={handleContinue}
              t={t}
            />
          )}
          {screen === "results" && <ResultsScreen score={score} hearts={hearts} onRestart={restart} t={t} />}
        </div>
      </PhoneFrame>
    </div>
  );
};

/* ---- SCREENS ---- */

const WelcomeScreen = ({ onStart, t }: { onStart: () => void; t: any }) => (
  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', gap: 12 }}>
    <div className="animate-float" style={{ fontSize: 64 }}>🧠</div>
    <span style={{ background: '#FF6B9D', color: '#FFFFFF', fontSize: 12, fontWeight: 800, borderRadius: 20, padding: '5px 14px', display: 'inline-block' }}>{t("welcome.badge")}</span>
    <h1 style={{ fontSize: 24, fontWeight: 900, color: '#1A0A2E', margin: '4px 0' }}>{t("welcome.title")}</h1>
    <p style={{ fontSize: 13, fontWeight: 600, color: '#7A5A9A', margin: 0 }}>{t("welcome.description")}</p>
    <p style={{ fontSize: 12, fontWeight: 600, color: '#B09AC0', margin: 0 }}>{t("welcome.details")}</p>
    <button onClick={onStart} style={{ marginTop: 16, width: '100%', maxWidth: 280, padding: 14, borderRadius: 14, background: 'linear-gradient(135deg, #FF6B9D, #F43F5E)', borderBottom: '4px solid #BE185D', border: 'none', borderBottomStyle: 'solid', borderBottomWidth: 4, borderBottomColor: '#BE185D', color: '#FFFFFF', fontSize: 14, fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.03em', cursor: 'pointer' }}>
      {t("welcome.button")}
    </button>
  </div>
);

const BeforeScreen = ({ onContinue, t }: { onContinue: () => void; t: any }) => (
  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 16 }}>
    <h2 style={{ fontSize: 18, fontWeight: 900, color: '#1A0A2E', margin: 0, textAlign: 'left' }}>{t("before.title")}</h2>
    <p style={{ fontSize: 13, fontWeight: 600, color: '#7A5A9A', margin: 0, lineHeight: 1.6 }}>{t("before.p1")}</p>
    <p style={{ fontSize: 13, fontWeight: 600, color: '#7A5A9A', margin: 0, lineHeight: 1.6 }}>{t("before.p2")}</p>
    <div style={{ flex: 1 }} />
    <button onClick={onContinue} style={{ width: '100%', padding: 14, borderRadius: 14, background: 'linear-gradient(135deg, #A855F7, #7C3AED)', border: 'none', borderBottom: '4px solid #5B21B6', color: '#FFFFFF', fontSize: 14, fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.03em', cursor: 'pointer' }}>
      {t("before.button")}
    </button>
  </div>
);

const QuizScreen = ({ questionIdx, q, feedback, onSwipe, onContinue, t }: any) => {
  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 12 }}>
      <p style={{ fontSize: 14, fontWeight: 900, color: '#1A0A2E', margin: 0 }}>
        {t("quiz.questionCount").replace('{{current}}', String(questionIdx + 1)).replace('{{total}}', '5')}
      </p>

      {/* Swipe hints */}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
        <span style={{ background: '#FFF0F5', color: '#FF6B9D', border: '1.5px solid #FF6B9D', borderRadius: 10, padding: '6px 12px', fontSize: 11, fontWeight: 800 }}>{t("quiz.falseHint")}</span>
        <span style={{ background: '#F0FFF4', color: '#22C55E', border: '1.5px solid #22C55E', borderRadius: 10, padding: '6px 12px', fontSize: 11, fontWeight: 800 }}>{t("quiz.trueHint")}</span>
      </div>

      {/* Card area */}
      <div style={{ position: 'relative', minHeight: 190 }}>
        {feedback ? (
          <div style={{
            background: q.gradient,
            borderRadius: 22,
            padding: '28px 22px',
            minHeight: 180,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
            <p style={{ fontSize: 14, fontWeight: 800, color: '#FFFFFF', textAlign: 'center', lineHeight: 1.5, margin: 0 }}>
              {q.q}
            </p>
          </div>
        ) : (
          <div key={questionIdx} style={{ position: 'relative', zIndex: 2 }}>
            <SwipeCard
              question={q.q}
              gradient={q.gradient}
              onSwipe={onSwipe}
              disabled={false}
            />
          </div>
        )}
      </div>

      {/* Feedback */}
      {feedback && (
        <div
          className="animate-pop-in"
          style={{
            background: feedback.correct ? '#F0FFF4' : '#FFF0F5',
            border: `2px solid ${feedback.correct ? '#22C55E' : '#FF6B9D'}`,
            borderRadius: 16,
            padding: '12px 16px',
          }}
        >
          <p style={{ fontSize: 14, fontWeight: 900, color: feedback.correct ? '#15803D' : '#BE185D', margin: '0 0 4px' }}>{feedback.title}</p>
          <p style={{ fontSize: 11, fontWeight: 600, color: feedback.correct ? '#166534' : '#9D174D', margin: 0, lineHeight: 1.5 }}>{feedback.body}</p>
        </div>
      )}

      <div style={{ flex: 1 }} />

      {/* Continue button */}
      {feedback && (
        <button onClick={onContinue} style={{ width: '100%', padding: 14, borderRadius: 14, background: 'linear-gradient(135deg, #A855F7, #7C3AED)', border: 'none', borderBottom: '4px solid #5B21B6', color: '#FFFFFF', fontSize: 14, fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.03em', cursor: 'pointer' }}>
          {t("quiz.continue")}
        </button>
      )}
    </div>
  );
};

const ResultsScreen = ({ score, hearts, onRestart, t }: any) => {
  const emoji = score >= 4 ? "🎉" : score >= 2 ? "💪" : "🧠";
  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', gap: 12 }}>
      <div style={{ fontSize: 64 }}>{emoji}</div>
      <h1 style={{ fontSize: 24, fontWeight: 900, color: '#1A0A2E', margin: 0 }}>
        {score >= 4 ? t("results.amazing") : score >= 2 ? t("results.niceTry") : t("results.keepLearning")}
      </h1>
      <p style={{ fontSize: 13, fontWeight: 600, color: '#7A5A9A', margin: 0 }}>
        {t("results.scoreMsg").replace('{{score}}', score).replace('{{total}}', '5')}
      </p>
      <p style={{ fontSize: 13, fontWeight: 600, color: '#7A5A9A', margin: 0 }}>
        {t("results.heartsMsg")} {"♥".repeat(hearts)}{"♡".repeat(3 - hearts)}
      </p>
      <p style={{ fontSize: 12, fontWeight: 600, color: '#B09AC0', margin: 0, maxWidth: 260, lineHeight: 1.5 }}>
        {t("results.remember")}
      </p>
      <button onClick={onRestart} style={{ marginTop: 16, width: '100%', maxWidth: 280, padding: 14, borderRadius: 14, background: '#FFFFFF', color: '#A855F7', border: '2px solid #A855F7', borderBottom: '4px solid #A855F7', fontSize: 14, fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.03em', cursor: 'pointer' }}>
        {t("results.tryAgain")}
      </button>
    </div>
  );
};

export default ThoughtOrTruth;
