import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import tw from 'twrnc';
import { TimerType } from '../slices/timer/timerStorage';
import { useUpdateIntervalMutation } from '../slices/interval/intervalsApi';
import { useSaveTimerMutation, useClearTimerMutation } from '../slices/timer/timerApi';

type TimerFieldProps = {
  timer?: TimerType | null;
  intervalId: string;
};

export const TimerField = ({ 
  timer,
  intervalId
}: TimerFieldProps) => {
  const [updateInterval] = useUpdateIntervalMutation();
  const [saveTimer] = useSaveTimerMutation()
  const [clearTimer] = useClearTimerMutation()
  const isTimerActive = Boolean(timer);
  const timerStart = timer?.startTime;
  
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  useEffect(() => {
    let timerInterval: number;

    if (isTimerActive && timerStart) {
      const startTime = new Date(timerStart);
      
      const updateTimer = () => {
        const now = new Date();
        const diff = Math.floor((now.getTime() - startTime.getTime()) / 1000);
        setElapsedSeconds(diff);
      };

      updateTimer();
      timerInterval = setInterval(updateTimer, 1000);
    }

    return () => {
      if (timerInterval) clearInterval(timerInterval);
    };
  }, [isTimerActive, timerStart]);

  const handleStartTimer = () => {
    const startTime = new Date().toISOString();
    const now = new Date();
    
    const hours = now.getHours();
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const seconds = now.getSeconds().toString().padStart(2, '0');
    const formattedTime = `${hours}:${minutes}:${seconds}`;
    
    updateInterval({
      id: intervalId,
      interval: { 
        startTime: formattedTime,
        endTime: formattedTime
      }
    });
    
    saveTimer({ 
      intervalId: intervalId,
      startTime: startTime 
    })
  };
  
  const formatTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleStopTimer = () => {
    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const seconds = now.getSeconds().toString().padStart(2, '0');
    const endTime = `${hours}:${minutes}:${seconds}`;
    
    updateInterval({
      id: intervalId,
      interval: { endTime }
    });
    clearTimer()
  };

  return (
    <View style={tw`flex-row items-center gap-2 mb-1`}>
      <TouchableOpacity
        onPress={isTimerActive ? handleStopTimer : handleStartTimer}
        style={[
          tw`rounded-lg px-4 py-2 items-center justify-center min-w-16`,
          isTimerActive ? tw`bg-red-500` : tw`bg-green-500`
        ]}
      >
        <Text style={tw`text-white text-base font-bold`}>
          {isTimerActive ? '⏹️' : '▶️'}
        </Text>
      </TouchableOpacity>

      <View style={tw`flex-1`}>
        <View style={[
          tw`rounded-lg px-3 py-2 items-center`,
          isTimerActive ? tw`bg-green-100 border-2 border-green-500` : tw`bg-gray-100`
        ]}>
          <Text style={[
            tw`text-sm font-bold`,
            isTimerActive ? tw`text-green-800` : tw`text-gray-600`
          ]}>
            {isTimerActive ? formatTime(elapsedSeconds) : '00:00:00'}
          </Text>
        </View>
      </View>
    </View>
  );
};