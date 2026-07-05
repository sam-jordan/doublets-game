export default function Help(props: { showHelp: boolean, setShowHelp: React.Dispatch<React.SetStateAction<boolean>> }) {
    return props.showHelp ? <div className="fixed top-5 bg-grey-very-dark">
        <button className="w-4" onClick={() => props.setShowHelp(!props.showHelp)}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640">
                <path fill="rgb(255, 255, 255)" d="M183.1 137.4C170.6 124.9 150.3 124.9 137.8 137.4C125.3 149.9 125.3 170.2 137.8 182.7L275.2 320L137.9 457.4C125.4 469.9 125.4 490.2 137.9 502.7C150.4 515.2 170.7 515.2 183.2 502.7L320.5 365.3L457.9 502.6C470.4 515.1 490.7 515.1 503.2 502.6C515.7 490.1 515.7 469.8 503.2 457.3L365.8 320L503.1 182.6C515.6 170.1 515.6 149.8 503.1 137.3C490.6 124.8 470.3 124.8 457.8 137.3L320.5 274.7L183.1 137.4z"/>
            </svg>
        </button>
        <h3>How to Play</h3>
        <p>Connect the start and end words using similar words.</p>
        <ul>
            <li>
                Change <strong>exactly one</strong> letter between each guess,<br />
                indicated by the <span className="text-pink-bright">pink</span> tiles.
            </li>
            <li>
                Each guess must be a valid word.
            </li>
            <li>
                Guesses can be selected using the mouse, the arrow keys or Enter/Backspace.
            </li>
            <li>
                Press Enter on the final guess to submit! <br />
                Don't worry, you can keep trying if the submission isn't valid.
            </li>
        </ul>
    </div> : null;
}