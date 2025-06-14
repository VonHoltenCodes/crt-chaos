#!/usr/bin/env python3
"""
Generate simple sound effects without external dependencies
Creates basic but audible sounds for CRT Chaos
"""

import wave
import struct
import math
import random
import os

def create_wav_file(filename, data, sample_rate=44100):
    """Write audio data to a WAV file"""
    with wave.open(filename, 'w') as wav_file:
        wav_file.setnchannels(1)  # Mono
        wav_file.setsampwidth(2)   # 16-bit
        wav_file.setframerate(sample_rate)
        
        # Convert float data to 16-bit integers
        max_val = max(abs(min(data)), abs(max(data))) or 1
        scaled_data = [int(sample / max_val * 32767 * 0.8) for sample in data]
        
        # Pack as bytes
        packed_data = struct.pack('<' + 'h' * len(scaled_data), *scaled_data)
        wav_file.writeframes(packed_data)

def generate_glitch_sound(duration=0.2, sample_rate=44100):
    """Create a digital glitch sound"""
    samples = int(sample_rate * duration)
    data = []
    
    for i in range(samples):
        t = i / sample_rate
        
        # Mix of different frequencies and noise
        if i < samples // 3:
            # Low frequency buzz
            sample = math.sin(2 * math.pi * 80 * t) * 0.3
        elif i < 2 * samples // 3:
            # White noise
            sample = random.uniform(-0.5, 0.5)
        else:
            # High frequency
            sample = math.sin(2 * math.pi * 1200 * t) * 0.2
        
        # Add random glitches
        if random.random() > 0.9:
            sample = random.uniform(-0.8, 0.8)
        
        data.append(sample)
    
    return data

def generate_error_sound(duration=0.5, sample_rate=44100):
    """Create an error beep sound"""
    samples = int(sample_rate * duration)
    data = []
    
    for i in range(samples):
        t = i / sample_rate
        
        # Descending tone
        freq = 800 - (t * 400)
        sample = math.sin(2 * math.pi * freq * t) * math.exp(-t * 3) * 0.5
        data.append(sample)
    
    return data

def generate_success_sound(duration=0.6, sample_rate=44100):
    """Create a success chime sound"""
    samples = int(sample_rate * duration)
    data = []
    
    # Three ascending notes (C5, E5, G5)
    notes = [523.25, 659.25, 783.99]
    
    for i in range(samples):
        t = i / sample_rate
        note_index = int(t * 5)  # Play each note for ~0.2 seconds
        
        if note_index < len(notes):
            freq = notes[note_index]
            sample = math.sin(2 * math.pi * freq * t) * math.exp(-t * 2) * 0.4
        else:
            sample = 0
        
        data.append(sample)
    
    return data

def generate_typing_sound(duration=0.05, sample_rate=44100):
    """Create a typing/click sound"""
    samples = int(sample_rate * duration)
    data = []
    
    for i in range(samples):
        t = i / sample_rate
        
        # Mix of frequencies for mechanical click
        sample = (math.sin(2 * math.pi * 3000 * t) * 0.1 +
                  math.sin(2 * math.pi * 1500 * t) * 0.1 +
                  random.uniform(-0.1, 0.1))
        
        # Sharp decay
        sample *= math.exp(-t * 100)
        data.append(sample)
    
    return data

def generate_beep_sound(duration=0.1, sample_rate=44100):
    """Create a simple beep"""
    samples = int(sample_rate * duration)
    data = []
    
    for i in range(samples):
        t = i / sample_rate
        sample = math.sin(2 * math.pi * 1000 * t) * 0.3 * math.exp(-t * 10)
        data.append(sample)
    
    return data

def generate_static_sound(duration=1.0, sample_rate=44100):
    """Create TV static noise"""
    samples = int(sample_rate * duration)
    data = []
    
    for i in range(samples):
        # White noise with occasional pops
        sample = random.uniform(-0.1, 0.1)
        if random.random() > 0.999:
            sample = random.uniform(-0.5, 0.5)
        data.append(sample)
    
    return data

# Main execution
if __name__ == "__main__":
    sounds_dir = 'assets/sounds'
    
    print("Generating real sound effects...")
    
    # Generate all sounds
    sounds = {
        'glitch_real.wav': generate_glitch_sound(),
        'error_real.wav': generate_error_sound(),
        'success_real.wav': generate_success_sound(),
        'typing_real.wav': generate_typing_sound(),
        'beep_real.wav': generate_beep_sound(),
        'static_real.wav': generate_static_sound()
    }
    
    for filename, data in sounds.items():
        filepath = os.path.join(sounds_dir, filename)
        create_wav_file(filepath, data)
        print(f"Created: {filepath}")
    
    # Also create simple power on/off sounds
    power_on_data = []
    for i in range(44100):  # 1 second
        t = i / 44100
        # Rising frequency
        freq = 50 + t * 5000
        sample = math.sin(2 * math.pi * freq * t) * math.exp(-t * 2) * 0.4
        power_on_data.append(sample)
    
    create_wav_file(os.path.join(sounds_dir, 'power-on_real.wav'), power_on_data)
    print(f"Created: {os.path.join(sounds_dir, 'power-on_real.wav')}")
    
    power_off_data = []
    for i in range(22050):  # 0.5 seconds
        t = i / 44100
        # Falling frequency
        freq = 5000 - t * 10000
        sample = math.sin(2 * math.pi * freq * t) * math.exp(-t * 10) * 0.5
        power_off_data.append(sample)
    
    create_wav_file(os.path.join(sounds_dir, 'power-off_real.wav'), power_off_data)
    print(f"Created: {os.path.join(sounds_dir, 'power-off_real.wav')}")
    
    print("\nAll sounds generated as WAV files!")
    print("\nNow converting to MP3 format...")
    
    # Try to convert using ffmpeg if available
    import subprocess
    try:
        # Convert the main sounds we need
        for sound in ['glitch', 'error', 'success', 'typing']:
            wav_file = f"assets/sounds/{sound}_real.wav"
            mp3_file = f"assets/sounds/{sound}.mp3"
            subprocess.run(['ffmpeg', '-i', wav_file, mp3_file, '-y'], 
                         capture_output=True, check=True)
            print(f"Converted {sound}.mp3")
    except:
        print("\nffmpeg not found. The WAV files are ready to use!")
        print("You can convert them online at cloudconvert.com")