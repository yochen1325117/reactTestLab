import React, { useEffect, useState } from "react";

import MagicBlock from '../../components/MagicBlock';
import './style.scss'


const setDefaultAnswerButtonList = () => {
    const answerLen = 6
    const array = [];
    const defalutBlock = {
        status: '',
        context: '',
    };
    for (let i = 0; i<answerLen; i++) {
        array.push(defalutBlock);
    }
    return array;
}

function NumberTestGame() {
    const answerChoose = 6;
    const answerChooseArray = setDefaultAnswerButtonList(answerChoose);
    const answerTimeList = Array.from(Array(8).keys());
  const questionNumberList = [1,2,3,4,5,6,7,8,9];
  const questionSymbolList = [ '+', '-', 'x', '/' ]
  return (
    <div className="NumberTestGame">
        NumberTestGame
        { answerChoose }
        {
            answerTimeList.map((time, index) => (
                <div key={`time_${index}`} className="question-block">
                {
                    answerChooseArray.map((aD, index) => <MagicBlock key={`block_${index}`} status="" context="" disable={false} blockStyle={{}} contextStyle={{}} />)
                }
          </div>
            ))
        }
    </div>
  );
}

export default NumberTestGame;
