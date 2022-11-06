import Head from "next/head";
import React, { useCallback, useEffect, useState } from "react";
import * as axiosPkg from "axios";
import { TailSpin } from "react-loader-spinner";

const axios = axiosPkg.default;

export interface QuizAPI {
  category?: string;
  id?: string;
  correctAnswer?: string;
  incorrectAnswers?: string[];
  question?: string;
  tags?: string[];
  type?: string;
  difficulty?: string;
  regions?: any[];
}

export default function Home() {
  const [data, setData] = useState<QuizAPI[] | null>(null);
  const [qNum, setQNum] = useState<number | null>(0);
  const [selectedOption, setSelectedOption] = useState<string>("");
  const [correctAnswers, setCorrectAnswers] = useState<number>(0);
  const [options, setOptions] = useState<string[]>([]);

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
    }

    if (data![num].correctAnswer === selectedOption)
      setCorrectAnswers(correctAnswers + 1);

    setOptions([]);
    setSelectedOption("");
    setQNum(num + 1);
  };

  const refreshPage = () => {
    setData([]);
    setQNum(0);
    setSelectedOption("");
    setCorrectAnswers(0);
    setOptions([]);
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

      <div className="navbar justify-center bg-zinc-600 text-neutral-content rounded-b-xl shadow-md">
        <a className="btn btn-ghost uppercase text-xl tracking-widest">
          Quizlet
        </a>
      </div>

      {data?.length ? (
        <div className="quizbox mt-20 grid justify-center">
          <div className="card w-96 bg-zinc-600 text-white shadow-md border-secondary border-2">
            <div className="card-body">
              <div className="">
                {qNum !== null && data.length ? (
                  <>
                    <progress
                      className="progress progress-primary w-auto"
                      value={qNum! > 0 ? ((qNum! + 1) / 5) * 100 : 0}
                      max="100"
                    ></progress>
                    <div className="bg-zinc-800 p-5 rounded-xl">
                      <h2 className="card-title">Question {qNum + 1} / 5</h2>
                      <p className="mt-2 font-semibold">
                        {data[qNum].question}
                      </p>
                    </div>
                  </>
                ) : (
                  <div>
                    <h2 className="card-title">Quiz Completed!</h2>
                    <p className="font-medium mt-5">
                      You got {correctAnswers} out of 5 questions correct.
                    </p>

                    <progress
                      className="progress progress-success bg-error"
                      value={(correctAnswers / 5) * 100}
                      max="100"
                    ></progress>

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
                        <div className="form-control" key={key}>
                          <label className="label cursor-pointer">
                            <span className="label-text text-white">
                              <span className="font-semibold">
                                {optionNames[key]}
                              </span>{" "}
                              {value}
                            </span>
                            <input
                              type="radio"
                              name="radio-10"
                              className="radio border-white checked:bg-primary"
                              onClick={() => setSelectedOption(value)}
                              checked={selectedOption === value}
                              readOnly
                            />
                          </label>
                        </div>
                      ))}
                    <div className="card-actions justify-end mt-5">
                      <button
                        className="btn btn-primary text-white"
                        onClick={() => nextQuestion(qNum!)}
                      >
                        Next
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="h-screen flex items-center justify-center">
          <TailSpin
            height="80"
            width="80"
            color="rgb(167 139 250)"
            ariaLabel="tail-spin-loading"
            radius="1"
            wrapperStyle={{}}
            wrapperClass=""
            visible={true}
          />
        </div>
      )}
      <div className="footer fixed left-0 bottom-0 w-screen p-2">
        Aktindo &copy; {new Date().getFullYear()}
      </div>
    </div>
  );

  //
}
