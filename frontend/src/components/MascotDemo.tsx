import React from 'react';
import {MascotEmotion, MascotState } from './Mascot';
import { useMascotContext } from './MascotContext';

// Example of how to use the mascot system throughout your app
export const MascotDemo = () => {
  const mascot = useMascotContext();

  // Example usage scenarios
  const scenarios = [
    {
      name: 'Welcome Message',
      action: () => mascot.showMessage("Welcome to Rebel Budget! I'm here to help you manage your money.", 'happy', 'speaking')
    },
    {
      name: 'Budget Warning',
      action: () => mascot.showMessage("Careful! You're approaching your monthly budget limit.", 'concerned', 'warning')
    },
    {
      name: 'Celebration',
      action: () => mascot.showMessage("Great job! You saved $200 this month!", 'excited', 'celebrating')
    },
    {
      name: 'Thinking',
      action: () => mascot.showMessage("Let me analyze your spending patterns...", 'thinking', 'helping')
    },
    {
      name: 'Surprise',
      action: () => mascot.showMessage("Wow! Your investment portfolio grew by 15%!", 'surprised', 'speaking')
    }
  ];

  const emotions: MascotEmotion[] = ['neutral', 'happy', 'excited', 'concerned', 'thinking', 'surprised', 'sad', 'angry', 'sleepy', 'winking'];
  const states: MascotState[] = ['idle', 'speaking', 'listening', 'celebrating', 'warning', 'helping'];

  return (
    <div className="p-8 bg-p5-black text-p5-white font-comic">
      <h1 className="text-4xl font-extrabold mb-8 text-p5-yellow">Mascot System Demo</h1>
      
      {/* Scenario Buttons */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4 text-p5-red">Scenario Examples</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {scenarios.map((scenario, index) => (
            <button
              key={index}
              onClick={scenario.action}
              className="bg-p5-red hover:bg-red-600 border-comic border-2 border-p5-white rounded-comic p-4 transition-all hover:scale-105"
            >
              {scenario.name}
            </button>
          ))}
        </div>
      </div>

      {/* Emotion Controls */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4 text-p5-red">Emotions</h2>
        <div className="grid grid-cols-5 gap-2">
          {emotions.map((emotion) => (
            <button
              key={emotion}
              onClick={() => mascot.changeEmotion(emotion)}
              className={`bg-p5-yellow hover:bg-yellow-400 text-p5-black border-comic border-2 rounded-comic p-2 text-sm transition-all hover:scale-105 ${
                mascot.emotion === emotion ? 'border-p5-red bg-yellow-300' : 'border-p5-black'
              }`}
            >
              {emotion}
            </button>
          ))}
        </div>
      </div>

      {/* State Controls */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4 text-p5-red">States</h2>
        <div className="grid grid-cols-3 gap-2">
          {states.map((state) => (
            <button
              key={state}
              onClick={() => mascot.changeState(state)}
              className={`bg-p5-yellow hover:bg-yellow-400 text-p5-black border-comic border-2 rounded-comic p-2 text-sm transition-all hover:scale-105 ${
                mascot.state === state ? 'border-p5-red bg-yellow-300' : 'border-p5-black'
              }`}
            >
              {state}
            </button>
          ))}
        </div>
      </div>

      {/* Visibility Controls */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4 text-p5-red">Visibility</h2>
        <div className="flex gap-4">
          <button
            onClick={mascot.show}
            className="bg-green-600 hover:bg-green-500 border-comic border-2 border-p5-white rounded-comic p-3 transition-all hover:scale-105"
          >
            Show Mascot
          </button>
          <button
            onClick={mascot.hide}
            className="bg-red-600 hover:bg-red-500 border-comic border-2 border-p5-white rounded-comic p-3 transition-all hover:scale-105"
          >
            Hide Mascot
          </button>
        </div>
      </div>
    </div>
  );
};

export default MascotDemo; 