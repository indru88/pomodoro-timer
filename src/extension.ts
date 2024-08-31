import * as vscode from 'vscode';
import * as path from 'path';

let timer: NodeJS.Timeout | undefined;
let timeLeft: number = 0;
let statusBarItem: vscode.StatusBarItem;
let isRunning: boolean = false;
let isPomodoro: boolean = true;

export function activate(context: vscode.ExtensionContext) {
    statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, 100);
    resetStatusBar();
    statusBarItem.command = 'pomodoro.toggle';
    statusBarItem.show();

    let togglePomodoro = vscode.commands.registerCommand('pomodoro.toggle', () => {
        if (isRunning) {
            stopTimer();
        } else {
            if (isPomodoro) {
                startPomodoroTimer();
            } else {
                startBreakTimer();
            }
        }
    });

    context.subscriptions.push(togglePomodoro, statusBarItem);
}

function startPomodoroTimer() {
    timeLeft = 25 * 60;
    statusBarItem.text = '$(play-circle) 25:00';
    isRunning = true;
    isPomodoro = true;
    startTimer('Pomodoro started! Time to focus!');
}

function startBreakTimer() {
    timeLeft = 5 * 60;
    statusBarItem.text = '$(debug-pause) 5:00';
    isRunning = true;
    isPomodoro = false;
    startTimer('Break time started! Relax!');
}

function startTimer(message: string) {
    if (timer) {
        clearInterval(timer);
    }
    vscode.window.showInformationMessage(message);

    timer = setInterval(() => {
        timeLeft--;
        updateStatusBar();
        if (timeLeft <= 0) {
            clearInterval(timer);
            vscode.window.showInformationMessage('Time is up!');
            stopTimer();
        }
    }, 1000);
}

function stopTimer() {
    if (timer) {
        clearInterval(timer);
    }
    isRunning = false;
    if (isPomodoro) {
        statusBarItem.text = '$(debug-pause) Start Break';
        isPomodoro = false;
    } else {
        resetStatusBar();
    }
}

function updateStatusBar() {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    statusBarItem.text = `$(clock) ${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
}

function resetStatusBar() {
    statusBarItem.text = '$(play-circle) Start Pomodoro';
    isPomodoro = true;
    isRunning = false;
}

export function deactivate() {
    if (timer) {
        clearInterval(timer);
    }
}
