import React, { useEffect, useState, useContext } from "react";
import { ThemeContext } from '../../AppRouter';

import * as _ from 'lodash';
import randomMathQuestion from 'random-math-question';
import MagicBlock from '../../components/MagicBlock';
import SetimeModal from '../../components/SetimeModal';
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
    const questionParser = `${question.question}`.split(" ").join("");
        const answerParser = `${question.answer}`.split(" ").join("");
        if (answerParser > 0) {
          checkQuestion = `${questionParser}=${answerParser}`;
        }
        questionChecker =checkQuestion.length === 8 && questReg.test(checkQuestion);
    }
    console.log('question', checkQuestion);
    return checkQuestion.split("")
}

const setNumberList = () => {
    const list = [];
    for (let i = 1; i< 10;i++) {
        list.push({
            status: '',
            context: i
        })
    }
    return list;
}

const setSymbolList = () => {
    const questionSymbolList = [ '+', '-', 'x', '/', '=' ]
    const list = [];
    questionSymbolList.map(symbol => {
        list.push({
            status: '',
            context: symbol
        })
    })
    return list;
}


function NumberTestGame() {
    const answerChoose = 8;
    const answerTime = 6;
    const [answerNow, setAnswerNow] = useState(0);
    const [question, setQuestionState] = useState([]);
    const answerChooseArray = setOneAnswerList(answerChoose);
    const defaultAnswerTimeList = setDefaultAnswerList(answerChooseArray, answerTime);
    const [answerTimeList, setAnswerTimeList] = useState(defaultAnswerTimeList);
    const [questionNumberList, setQuestionNumberList] = useState(setNumberList());
    const [questionSymbolList, setQuestionSymbolList] = useState(setSymbolList());
    const contextType = useContext(ThemeContext);


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
            let correctAnswer = 0;
            if (googAnswer) {
                const questionChecker = _.cloneDeep(question);
                // 先檢查正確答案
                answerNowList = answerNowList.map((answer, index) => {
                    // const questionIndex = questionChecker.indexOf(`${answer.context}`)
                    const numberFilter = questionNumberList.filter(number => `${number.context}` === `${answer.context}`);
                    const symbolFilter = questionSymbolList.filter(symbol => symbol.context === answer.context);
                    if (`${answer.context}` === questionChecker[index]) {
                        answer.status = 'correct'
                        questionChecker[index] = '';
                        correctAnswer++;
                        if (numberFilter && numberFilter[0] && numberFilter.status !== 'correct') {
                            numberFilter[0].status = 'correct';
                        }
                        if (symbolFilter && symbolFilter[0] && symbolFilter.status !== 'correct') {
                            symbolFilter[0].status = 'correct';
                        }
                    };
                    
                    return answer;
                });

                // 再檢查錯位，錯誤答案
                answerNowList = answerNowList.map((answer, index) => {

                    const questionIndex = questionChecker.indexOf(`${answer.context}`)
                    const numberFilter = questionNumberList.filter(number => `${number.context}` === `${answer.context}`);
                    const symbolFilter = questionSymbolList.filter(symbol => symbol.context === answer.context);

                    if (answer.status === '') {
                        if (questionIndex > -1) {
                            answer.status = 'wrong-side'
                            questionChecker[questionIndex] = '';
                            if (numberFilter && numberFilter[0] && numberFilter.status !== 'correct') {
                                numberFilter[0].status = 'wrong-side';
                            }
                            if (symbolFilter && symbolFilter[0] && symbolFilter.status !== 'correct') {
                                symbolFilter[0].status = 'wrong-side';
                            }
                        } else {
                            answer.status = 'check'
                            if (numberFilter && numberFilter[0] && numberFilter.status !== 'correct') {
                                numberFilter[0].status = 'check';
                            }
                            if (symbolFilter && symbolFilter[0] && symbolFilter.status !== 'correct') {
                                symbolFilter[0].status = 'check';
                            }
                        }
                    }
                    return answer;
                });
                // answerNowList = answerNowList.map(answer => ({ status: 'check', context: answer.context }));
                answerTimeList[answerNow] = answerNowList
                setAnswerTimeList([...answerTimeList]);
                setAnswerNow(answerNow + 1);
                setQuestionNumberList(questionNumberList);
                setQuestionSymbolList(questionSymbolList);
                if (correctAnswer === 8) {
                    setAnswerNow(99);
                    showModal('恭喜成功解答，重整可以再換題目喔')
                }
            } else {
                showModal('罰你國小重讀')
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

    const showModal = (context) => {
        contextType.setModal({ show: true, context })
        setTimeout(() => {
            contextType.setModal({ show: false, context: '' })
        }, 800)
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
            {
                answerNow < 99 && answerNow !== 6 &&
                <p>第 { answerNow + 1 } 次嘗試 / 共可嘗試 { answerTime } 次</p>
            }
            {
                answerNow === 99 &&
                <p>恭喜成功</p>
            }
            {
                answerNow === 6 &&
                <p>真可惜，答案是 {question.join('')} </p>
            }
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
                    <MagicBlock key={`block_${number.context}`} context={number.context} disable={false} blockStyle={styleObject[number.status] || {}} clickFunction={() => { addAnswerClick(number.context); }}/>
                ))
            }
            </div>
            <div className="question-symbol-list-block">
            {
                questionSymbolList.map(symbol => (
                    <MagicBlock key={`block_${symbol.context}`} context={symbol.context} disable={false} blockStyle={styleObject[symbol.status] || {}} clickFunction={() => { addAnswerClick(symbol.context); }}/>
                ))
            }
            </div>
            <div className="button-block">
                <button className="delete-button" onClick={deleteAnswer}>--</button>
                <button className="submit-button" onClick={sendAnswer}>送出</button>
            </div>
            <SetimeModal context='' />
        </div>
    );
}

export default NumberTestGame;
