import React, { useEffect, useState } from "react";

import Head from "next/head";
import * as axiosPkg from "axios";

import { QuizAPI } from "../interfaces/QuizApi";
import { TailSpin } from "react-loader-spinner";
import { Check } from "react-feather";
import { Footer, Navbar, ProgressBar, Spinner } from "../components";

const axios = axiosPkg.default;

export default function Home() {
  const [data, setData] = useState<QuizAPI[] | null>(null);
  const [qNum, setQNum] = useState<number | null>(0);
  const [selectedOption, setSelectedOption] = useState<string>("");
  const [correctAnswers, setCorrectAnswers] = useState<number>(0);
  const [options, setOptions] = useState<string[]>([]);
  const [answerIsCorrect, setAnswerIsCorrect] = useState<boolean>(false);
  const [verified, setVerified] = useState<boolean>(false);

  useEffect(() => {
    getQuestion().then((res) => {
      const resData: QuizAPI[] = res.data;
      setData(resData || []);
    });
  }, []);

  const optionNames = ["A)", "B)", "C)", "D)"];

  const getQuestion = () => {
    const data = axios.get("https://the-trivia-api.com/api/questions", {
      params: {
        limit: 5,
      },
    });

    return data;
  };

  const nextQuestion = (num: number) => {
    if (num >= 4) {
      return setQNum(null);
    } else {
      setOptions([]);
      setSelectedOption("");
      setQNum(num + 1);
      setAnswerIsCorrect(false);
      setVerified(false);
    }
  };

  const verifyQuestion = (num: number) => {
    if (data![num].correctAnswer === selectedOption) {
      setCorrectAnswers(correctAnswers + 1);
      setAnswerIsCorrect(true);
      setVerified(true);
    } else {
      setAnswerIsCorrect(false);
      setVerified(true);
    }
  };

  const refreshPage = () => {
    setData([]);
    setQNum(0);
    setSelectedOption("");
    setCorrectAnswers(0);
    setOptions([]);
    setVerified(false);
    setAnswerIsCorrect(false);
    getQuestion().then((res) => {
      const resData: QuizAPI[] = res.data;
      setData(resData || []);
    });
  };

  const shuffle = (array: string[]) => {
    for (var i = array.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var temp = array[i];
      array[i] = array[j];
      array[j] = temp;
    }

    return array;
  };

  let optionsArr: string[] = [];

  if (data?.length && !options.length) {
    optionsArr = shuffle([
      ...data![qNum!].incorrectAnswers!,
      data![qNum!].correctAnswer!,
    ]);

    setOptions(optionsArr);
  }

  return (
    <div className="main bg-zinc-800 h-screen">
      <Head>
        <title>Quizlet | Aktindo</title>
      </Head>

      <Navbar />

      {data?.length ? (
        <div className="quizbox mt-20 grid justify-center">
          <div className="card max-w-4xl card-bordered w-auto mx-4 bg-zinc-600 text-white shadow-md border-secondary border-2">
            <div className="card-body">
              <div className="">
                {qNum !== null && data.length ? (
                  <>
                    <ProgressBar
                      type="questions"
                      correctAnswers={correctAnswers}
                      questionNumber={qNum}
                      questions={5}
                    />
                    <div className="bg-zinc-700 p-5 rounded-xl">
                      <h2 className="card-title text-base font-medium">
                        Question {qNum + 1} / 5
                      </h2>
                      <p className="mt-2 text-lg md:text-2xl sm:text-xl font-bold">
                        {data[qNum].question}
                      </p>
                    </div>
                  </>
                ) : (
                  <div>
                    <h2 className="card-title">Quiz Completed!</h2>
                    <p className="font-medium mt-5">
                      You got {correctAnswers} out of 5 questions correct
                    </p>

                    <ProgressBar
                      type="result"
                      correctAnswers={correctAnswers}
                      questionNumber={qNum!}
                      questions={5}
                    />

                    <div className="card-actions justify-center mt-5">
                      <button
                        className="btn btn-primary text-white"
                        onClick={refreshPage}
                      >
                        Retry
                      </button>
                    </div>
                  </div>
                )}
              </div>

              <div>
                {(qNum as number) !== null && (
                  <div>
                    {data &&
                      options!.map((value, key) => (
                        <div
                          className={`form-control p-2 my-2 rounded-md shadow-lg ${
                            selectedOption === value && verified
                              ? answerIsCorrect
                                ? "bg-green-500"
                                : "bg-error"
                              : `hover:bg-zinc-700 transition ${
                                  selectedOption === value
                                    ? "bg-zinc-700"
                                    : "bg-zinc-500"
                                }`
                          }`}
                          key={key}
                        >
                          <label className="label cursor-pointer">
                            <span className="label-text text-white md:text-base break-normal">
                              <span className="font-semibold">
                                {optionNames[key]}
                              </span>{" "}
                              {value}
                            </span>
                            <input
                              type="radio"
                              name="radio-10"
                              className={`radio border-white ${
                                verified
                                  ? answerIsCorrect
                                    ? "checked:bg-green-600"
                                    : "checked:bg-error"
                                  : "checked:bg-primary"
                              }`}
                              onClick={() => setSelectedOption(value)}
                              checked={selectedOption === value}
                              readOnly
                              disabled={verified}
                            />
                          </label>
                        </div>
                      ))}

                    <div className="card-actions justify-end mt-5">
                      {verified ? (
                        <button
                          className={`btn ${
                            answerIsCorrect
                              ? "btn bg-green-500 hover:bg-green-600"
                              : "btn-error"
                          } text-white`}
                          onClick={() => nextQuestion(qNum!)}
                        >
                          Next
                        </button>
                      ) : (
                        <button
                          className="btn btn-primary text-white"
                          onClick={() => verifyQuestion(qNum!)}
                          disabled={selectedOption.length ? false : true}
                        >
                          <Check />
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <Spinner />
      )}
      <Footer />
    </div>
  );

  //
}
