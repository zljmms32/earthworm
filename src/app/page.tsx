"use client";

import { useEffect, useRef, useState } from "react";
import Question from "../components/Question";
import Answer from "../components/Answer";
import Statistics from "@/components/Statistics";

const failedCountTotal = 3;

export default function Home() {
  const [currentMode, setCurrentMode] = useState<
    "loading" | "question" | "answer"
  >("loading");

  const failedCount = useRef(0);
  const statementIndex = useRef(0);
  const currentCourse = useRef<any>({});

  let questionWord = "";
  let answerWord = "";
  let answerSoundmark = "";


  useEffect(() => {
    async function fetchData() {
      const response = await fetch("/api/main");
      const data = await response.json();
      currentCourse.current = data.data;
      setCurrentMode("question");
    }
    fetchData();
  }, []);

  const updateWord = () => {
    if (!currentCourse.current.statements) return;

    const { chinese, english, soundMark } =
      currentCourse.current.statements[statementIndex.current];

    questionWord = chinese;
    answerWord = english;
    answerSoundmark = soundMark;
  };

  const checkCorrect = (input: string) => {
    return input === answerWord;
  };

  const handleToNextStatement = () => {
    statementIndex.current++;
    setCurrentMode("question");
  };

  const handleCheckAnswer = (userInput: string) => {
    if (checkCorrect(userInput)) {
      setCurrentMode("answer");
    } else {
      failedCount.current++;

      if (failedCount.current >= failedCountTotal) {
        failedCount.current = 0;
        setCurrentMode("answer");
      }
    }
  };

  updateWord();

  return (
    <div className="container mx-auto flex h-full flex-1 flex-col items-center justify-center pb-10 h-96">
      <div className="container relative mx-auto flex h-full flex-col items-center">
        <div className="container flex flex-grow items-center justify-center">
          <div className="container flex h-full w-full flex-col items-center justify-center">
            <div className="container flex flex-grow flex-col items-center justify-center">
              <div className="flex flex-col items-center justify-center pb-1 pt-4">
                {currentMode === "question" ? (
                  <Question
                    word={questionWord}
                    onCheckAnswer={handleCheckAnswer}
                  ></Question>
                ) : (
                  <Answer
                    word={answerWord}
                    soundmark={answerSoundmark}
                    onToNextStatement={handleToNextStatement}
                  ></Answer>
                )}
              </div>
            </div>
          </div>
        </div>
        <Statistics />
      </div>
    </div>
  );
}
