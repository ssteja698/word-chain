import React, { useState, useEffect } from 'react'
import styles from "./style.module.scss";
import { englishWordList } from '../utils/index';

const startNames = [
    'Orange', 'Yellow', 'Red', 'Pink', 'Green', 'Blue', 'Violet', 'Indigo', 'Saffron', 'White', 'Black', 'Purple'
];

let completedWords = [];

function areEqual(firstStr, secondStr) {
    return firstStr.toUpperCase() === secondStr.toUpperCase();
}

function LandingPage() {
    const [score, setScore] = useState(0);
    const [currentWord, setCurrentWord] = useState(startNames[Math.floor(Math.random() * startNames.length)]);
    const [nextWord, setNextWord] = useState(null);
    const [startTheProcess, setStartTheProcess] = useState(false);
    const [isSubmitClicked, setIsSubmitClicked] = useState(false);
    const [quit, setQuit] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [encouragingMessage] = useState('Come on, you can do it ✌🏻');

    useEffect(() => {
        if (isSubmitClicked && nextWord) {
            if (!areEqual(nextWord[0], currentWord[currentWord.length - 1])) {
                setErrorMessage("Next word should start with the previous word's end");
                setQuit(true);
            } else {
                setScore((prevScore) => (prevScore + 20));
                setCurrentWord(nextWord);
            }
            setNextWord('');
        }
    }, [currentWord, nextWord, isSubmitClicked]);

    const handleStart = () => {
        completedWords = [];
        setCurrentWord(startNames[Math.floor(Math.random() * startNames.length)]);
        setScore(0);
        setQuit(false);
        setErrorMessage('');
        setStartTheProcess(true);
    }

    const handleSubmit = () => {
        if (englishWordList.indexOf(nextWord.toLowerCase()) < 0) {
            setErrorMessage("The spelling of the entered word is wrong! (or it's not in the list of well-known words)");
            setQuit(true);
            setNextWord('');
        } else if(completedWords.indexOf(nextWord) > -1) {
            setErrorMessage(`You entered the word ${nextWord} already! 😕`);
            setQuit(true);
            setNextWord('');
        } else {
            completedWords = [...completedWords, nextWord];
            setIsSubmitClicked(true);
        }
    }

    const handleInputChange = (event) => {
        if (isSubmitClicked) {
            setIsSubmitClicked(false);
        }
        setNextWord(event.target.value);
    }

    const handleKeyDown = (event) => {
        if(event.which === 13) {
            handleSubmit();
        }
    }

    return (
        <>
            <div className={styles.header}>
                {!quit && (
                    <div className={styles.score}>
                        <span>{"Score: "}</span>
                        {score}
                    </div>
                )}
                <h1>Word Chain</h1>
            </div>
            <div className={styles.lowerSection}>
                {(!startTheProcess || quit) && (
                    <button className={`${styles.primary} ${styles.shine}`} onClick={handleStart}>{quit ? "Try Again" : "Start"}</button>
                )}
                {startTheProcess && !quit && (
                    <>
                        <div className={styles.startWord}>
                            The current word is <span>{currentWord}</span>
                        </div>
                        <div className={styles.submitAnswer} onKeyDown={handleKeyDown}>
                            <input
                                autoFocus
                                spellCheck 
                                type="text" 
                                autoComplete="off" 
                                id="next-word" 
                                placeholder="Type in the Next Word" 
                                onChange={handleInputChange} 
                                value={nextWord || ''}
                            />
                            <button disabled={!nextWord} className={styles.submit} onClick={handleSubmit}>Submit</button>
                        </div>
                        <h3>{encouragingMessage}</h3>
                    </>
                )}
                {quit && (
                    <div className={styles.quit}>
                        {errorMessage && <h5>👉🏻 {errorMessage}</h5>}
                        <div className={styles.finalResult}>
                            <div>Sorry, you lost it! 😔</div>
                            <div>Your final score is <span>{score}</span></div>
                        </div>
                    </div>
                )}
            </div>
        </>
    )
}

export default LandingPage;
