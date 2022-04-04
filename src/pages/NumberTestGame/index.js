import React, { useEffect, useState } from "react";

import * as _ from 'lodash';
import randomMathQuestion from 'random-math-question';
import MagicBlock from '../../components/MagicBlock';
import './style.scss'


const setOneAnswerList = (answerChoose) => {
    const array = [];
    const defalutBlock = {
        status: '',
        context: '',
    };
    for (let i = 0; i<answerChoose; i++) {
        array.push(defalutBlock);
    }
    return array;
}

const setDefaultAnswerList = (onAnswerList, answerTime) => {
    const defaultList = [];
    for(let i = 0; i < answerTime; i++) {
        defaultList.push(onAnswerList);
    }
    return defaultList;
}

const setQuestion = () => {
    const questReg = /^[0-9+\-*\/=]{8}/;
    let checkQuestion = "";
    let question = {
        question: "",
        answer: "",
    };
    let questionChecker = checkQuestion.length === 8 && questReg.test(question.question);
    while (!questionChecker) {
    let question = randomMathQuestion.get({
        numberRange: "1-999",
        amountOfNumber: "2-3",
        operations: ["/", "*", "+", "-"],
    });
    console.log('question', question);
    const questionParser = `${question.question}`.split(" ").join("");
        const answerParser = `${question.answer}`.split(" ").join("");
        if (answerParser > 0) {
          checkQuestion = `${questionParser}=${answerParser}`;
        }
        questionChecker =checkQuestion.length === 8 && questReg.test(checkQuestion);
    }
    return checkQuestion.split("")
}




function NumberTestGame() {
    const answerChoose = 8;
    const answerTime = 6;
    const [answerNow, setAnswerNow] = useState(0);
    const [question, setQuestionState] = useState([]);
    const answerChooseArray = setOneAnswerList(answerChoose);
    const defaultAnswerTimeList = setDefaultAnswerList(answerChooseArray, answerTime);
    const [answerTimeList, setAnswerTimeList] = useState(defaultAnswerTimeList);
    const questionNumberList = [1,2,3,4,5,6,7,8,9];
    const questionSymbolList = [ '+', '-', 'x', '/', '=' ]

    useEffect(() => {
        const questionList = setQuestion();
        setQuestionState(questionList);
    }, [])

    useEffect(() => {
        window.addEventListener("keydown", keyDown);
        return () => {
            window.removeEventListener("keydown", keyDown);
        };
    }, [answerTimeList, answerNow])


    const addAnswerClick = (answer) => {
        if (answerNow < answerTime) {
            let answerNowList = _.cloneDeep(answerTimeList[answerNow]);
            const checkAnswerList = answerNowList.filter(answer => answer.context !== '');
            if(checkAnswerList.length < answerChoose) {
                answerNowList[checkAnswerList.length] = { status: '', context: answer }
                answerTimeList[answerNow] = answerNowList;
                console.log('answerTimeList', answerTimeList);
                setAnswerTimeList([...answerTimeList]);
            }
        }
    }

    const sendAnswer = () => {
        if (answerNow < answerTime) {
            let answerNowList = _.cloneDeep(answerTimeList[answerNow]);
            const checkAnswerList = answerNowList.filter(answer => answer.context !== '');
            if (checkAnswerList.length !== answerChoose) { return false; }
            const submitList = answerNowList.map((answer) => answer.context);
            const submitSplitList = submitList.join("").split("=");
            const evalList = Function('return (' + submitSplitList[0] + ')')();
            const equalList = submitSplitList[1];
            const googAnswer = +evalList === +equalList;
            if (googAnswer) {
                const questionChecker = _.cloneDeep(question);
                answerNowList = answerNowList.map((answer, index) => {
                    const questionIndex = questionChecker.indexOf(`${answer.context}`)
                    if (questionIndex > -1 && questionIndex === index) {
                        answer.status = 'correct'
                        questionChecker[questionIndex] = '';
                    };
                    return answer;
                });
                answerNowList = answerNowList.map((answer, index) => {
                    const questionIndex = questionChecker.indexOf(`${answer.context}`)
                    if (answer.status === '') {
                        answer.status = 'check'
                        if (questionIndex > -1) {
                            answer.status = 'wrong-side'
                            questionChecker[questionIndex] = '';
                        };
                    }
                    return answer;
                });
                // answerNowList = answerNowList.map(answer => ({ status: 'check', context: answer.context }));
                answerTimeList[answerNow] = answerNowList
                setAnswerTimeList([...answerTimeList]);
                setAnswerNow(answerNow + 1);
            }
        }
    }

    const deleteAnswer = () => {
        if (answerNow < answerTime) {
            let answerNowList = _.cloneDeep(answerTimeList[answerNow]);
            const checkAnswerList = answerNowList.filter(answer => answer.context !== '');
            if (checkAnswerList.length > 0) {
                answerNowList[checkAnswerList.length - 1] = { status: '', context: '' }
                answerTimeList[answerNow] = answerNowList
                setAnswerTimeList([...answerTimeList]);
            }
        }
    }

    const keyDown = (key) => {
        switch (key.key) {
          case "1":
          case "2":
          case "3":
          case "4":
          case "5":
          case "6":
          case "7":
          case "8":
          case "9":
          case "0":
          case "+":
          case "-":
          case "*":
          case "/":
          case "=":
            addAnswerClick(key.key)
            break;
          case "Backspace":
            deleteAnswer();
            break;
          case "Enter":
            sendAnswer();
            break;
          default:
            break;
        }
      }

    const styleObject = {
        'wrong-side': {
            border: '2px solid #33FFF9',
            backgroundColor: '#deb3cf',
        },
        check: {
            border: '2px solid black',
            backgroundColor: '#C0C0C0',
        },
        correct: {
            backgroundColor: '#b0e0e6',
        }
    }


    return (
        <div className="NumberTestGame">
            <p>第 { answerNow + 1 } 次嘗試 / 共可嘗試 { answerTime } 次</p>
            {
                answerTimeList && answerTimeList.map((onTimeList, index) => (
                    <div key={`time_${index}`} className="question-block">
                    {
                        onTimeList.map((aD, index) => <MagicBlock key={`block_${index}`} context={aD.context} disable={false} blockStyle={styleObject[aD.status] || {}} contextStyle={{}} />)
                    }
                    </div>
                ))
            }
            <div className="question-number-list-block">
            {
                questionNumberList.map(number => (
                    <MagicBlock key={`block_${number}`} context={number} disable={false} blockStyle={styleObject[number.status] || {}} clickFunction={() => { addAnswerClick(number); }}/>
                ))
            }
            </div>
            <div className="question-symbol-list-block">
            {
                questionSymbolList.map(symbol => (
                    <MagicBlock key={`block_${symbol}`} context={symbol} disable={false} blockStyle={styleObject[symbol.status] || {}} clickFunction={() => { addAnswerClick(symbol); }}/>
                ))
            }
            </div>
            <div>
                <button onClick={deleteAnswer}>--</button>
                <button onClick={sendAnswer}>送出</button>
            </div>
        </div>
    );
}

export default NumberTestGame;
