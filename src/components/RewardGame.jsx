import { useEffect, useState } from 'react';
import SingleCard from '../components/SingleCard';
import '../index.css';

const cardImages = [
    { src: '/img/helmet-1.png', matched: false },
    { src: '/img/potion-1.png', matched: false },
    { src: '/img/ring-1.png', matched: false },
    { src: '/img/scroll-1.png', matched: false },
    { src: '/img/shield-1.png', matched: false },
    { src: '/img/sword-1.png', matched: false },
];

function RewardGame() {
    const [cards, setCards] = useState([]);
    const [turns, setTurns] = useState(0);
    const [choiceOne, setChoiceOne] = useState(null);
    const [choiceTwo, setChoiceTwo] = useState(null);
    const [disabled, setDisabled] = useState(false);
    const [personalBest, setPersonalBest] = useState(null);

    useEffect(() => {
        if (choiceOne && choiceTwo) {
            setDisabled(true);
            if (choiceOne.src === choiceTwo.src) {
                setCards((prevCards) => {
                    const updatedCards = prevCards.map((card) => {
                        if (card.src === choiceOne.src) {
                            return { ...card, matched: true };
                        } else {
                            return card;
                        }
                    });
                    
                    // Check if this was the final match
                    const allMatched = updatedCards.every(card => card.matched);
                    if (allMatched) {
                        // Game complete! Check PB after the turn is incremented
                        setTimeout(() => {
                            const finalTurns = turns + 1;
                            if (personalBest === null || finalTurns < personalBest) {
                                savePersonalBest(finalTurns);
                            }
                        }, 1000);
                    }
                    
                    return updatedCards;
                });
                console.log('Those cards match!');
            } else {
                console.log('Sorry, those cards do not match.');
            }
            setTimeout(() => {
                resetTurn();
            }, 1000);
        }
    }, [choiceOne, choiceTwo, turns, personalBest]);

    console.log(cards);

    const resetTurn = () => {
        setChoiceOne(null);
        setChoiceTwo(null);
        setTurns((prevTurns) => prevTurns + 1);
        setDisabled(false);
    };

    // shuffle cards
    const shuffleCards = () => {
        const shuffledCards = [...cardImages, ...cardImages]
            .sort(() => Math.random() - 0.5)
            .map((card) => ({ ...card, id: Math.random() }));

        setCards(shuffledCards);
        setTurns(0);
    };

    const handleChoice = (card) => {
        choiceOne ? setChoiceTwo(card) : setChoiceOne(card);
    };

    const loadPersonalBest = () => {
        const savedData = localStorage.getItem('todo-app');
        if (savedData) {
            const data = JSON.parse(savedData);
            if (data.gamePB) {
                setPersonalBest(data.gamePB);
            }
        }
    };

    const savePersonalBest = (score) => {
        const savedData = localStorage.getItem('todo-app');
        let data = savedData ? JSON.parse(savedData) : {};
        data.gamePB = score;
        localStorage.setItem('todo-app', JSON.stringify(data));
        setPersonalBest(score);
    };

    useEffect(() => {
        shuffleCards();
        loadPersonalBest();
    }, []);

    return (
        <div className="reward-game">
            <div className="reward-container">
                <div className="card-grid">
                    {cards.map((card) => (
                        <SingleCard
                            key={card.id}
                            card={card}
                            handleChoice={handleChoice}
                            flipped={
                                card === choiceOne ||
                                card === choiceTwo ||
                                card.matched
                            }
                            disabled={disabled}
                        />
                    ))}
                </div>
                <div className="game-footer">
                    <p className="turns-counter">Turns: {turns}</p>
                    <p className="turns-counter">Lowest Turns: {personalBest !== null ? personalBest : '--'}</p>
                    <button onClick={shuffleCards} className="btn-new-game">
                        New Game
                    </button>
                </div>
            </div>
        </div>
    );
}

export default RewardGame;
