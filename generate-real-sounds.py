#!/usr/bin/env python3
"""
Generate real sound effects for CRT Chaos using Python
Creates actual audible sounds (not silent placeholders)
"""

import numpy as np
import wave
import struct
import os

def create_wav_file(filename, data, sample_rate=44100):
    """Write audio data to a WAV file"""
    # Ensure data is in the correct format
    data = np.array(data)
    data = data * 32767 / np.max(np.abs(data))  # Normalize
    data = data.astype(np.int16)
    
    with wave.open(filename, 'w') as wav_file:
        wav_file.setnchannels(1)  # Mono
        wav_file.setsampwidth(2)   # 16-bit
        wav_file.setframerate(sample_rate)
        wav_file.writeframes(data.tobytes())

def generate_glitch_sound():
    """Create a digital glitch sound"""
    sample_rate = 44100
    duration = 0.2
    samples = int(sample_rate * duration)
    
    # Mix of noise and frequency sweeps
    t = np.linspace(0, duration, samples)
    
    # Random noise bursts
    noise = np.random.normal(0, 0.1, samples)
    
    # Frequency sweep
    freq_sweep = np.sin(2 * np.pi * np.linspace(200, 2000, samples) * t)
    
    # Bit crushing effect
    bit_crush = np.sin(2 * np.pi * 1000 * t)
    bit_crush = np.floor(bit_crush * 4) / 4
    
    # Combine all elements
    sound = 0.3 * noise + 0.3 * freq_sweep + 0.2 * bit_crush
    
    # Add random dropouts
    for i in range(5):
        start = np.random.randint(0, samples - 100)
        sound[start:start+50] = 0
    
    return sound

def generate_error_sound():
    """Create an error beep sound"""
    sample_rate = 44100
    duration = 0.5
    samples = int(sample_rate * duration)
    
    t = np.linspace(0, duration, samples)
    
    # Two-tone error beep
    beep1 = np.sin(2 * np.pi * 800 * t) * np.exp(-t * 3)
    beep2 = np.sin(2 * np.pi * 600 * t) * np.exp(-t * 3)
    
    # First half: high tone, second half: low tone
    sound = np.zeros(samples)
    sound[:samples//2] = beep1[:samples//2]
    sound[samples//2:] = beep2[samples//2:]
    
    return sound * 0.5

def generate_success_sound():
    """Create a success chime sound"""
    sample_rate = 44100
    duration = 0.8
    samples = int(sample_rate * duration)
    
    t = np.linspace(0, duration, samples)
    
    # Three ascending notes (C, E, G)
    notes = [523.25, 659.25, 783.99]
    sound = np.zeros(samples)
    
    note_duration = samples // 3
    for i, freq in enumerate(notes):
        start = i * note_duration
        end = start + note_duration
        t_note = t[start:end]
        # Add envelope to make it sound nicer
        envelope = np.exp(-t_note * 5)
        sound[start:end] = np.sin(2 * np.pi * freq * t_note) * envelope
    
    return sound * 0.4

def generate_typing_sound():
    """Create a mechanical keyboard typing sound"""
    sample_rate = 44100
    duration = 0.05
    samples = int(sample_rate * duration)
    
    # Short click sound
    t = np.linspace(0, duration, samples)
    
    # Mix of frequencies for mechanical click
    click = (np.sin(2 * np.pi * 4000 * t) * 0.3 +
             np.sin(2 * np.pi * 2000 * t) * 0.3 +
             np.random.normal(0, 0.1, samples))
    
    # Sharp attack and decay
    envelope = np.exp(-t * 200)
    sound = click * envelope
    
    return sound * 0.5

def generate_beep_sound():
    """Create a simple beep"""
    sample_rate = 44100
    duration = 0.1
    samples = int(sample_rate * duration)
    
    t = np.linspace(0, duration, samples)
    sound = np.sin(2 * np.pi * 1000 * t) * np.exp(-t * 10)
    
    return sound * 0.5

def generate_power_on_sound():
    """Create a CRT power-on sound"""
    sample_rate = 44100
    duration = 1.0
    samples = int(sample_rate * duration)
    
    t = np.linspace(0, duration, samples)
    
    # Rising frequency sweep (CRT warming up)
    freq = np.linspace(50, 15000, samples)
    sound = np.sin(2 * np.pi * freq * t) * np.exp(-t * 2)
    
    # Add some static
    static = np.random.normal(0, 0.05, samples) * np.exp(-t * 5)
    
    return (sound + static) * 0.4

def generate_power_off_sound():
    """Create a CRT power-off sound"""
    sample_rate = 44100
    duration = 0.5
    samples = int(sample_rate * duration)
    
    t = np.linspace(0, duration, samples)
    
    # Descending frequency sweep with quick decay
    freq = np.linspace(5000, 50, samples)
    sound = np.sin(2 * np.pi * freq * t) * np.exp(-t * 10)
    
    return sound * 0.5

def generate_static_sound():
    """Create TV static noise"""
    sample_rate = 44100
    duration = 1.0
    samples = int(sample_rate * duration)
    
    # White noise
    sound = np.random.normal(0, 0.1, samples)
    
    # Add some variation
    lfo = np.sin(2 * np.pi * 0.5 * np.linspace(0, duration, samples))
    sound = sound * (0.8 + 0.2 * lfo)
    
    return sound

# Main execution
if __name__ == "__main__":
    sounds_dir = 'assets/sounds'
    
    # Generate all sounds
    sounds = {
        'glitch.wav': generate_glitch_sound(),
        'error.wav': generate_error_sound(),
        'success.wav': generate_success_sound(),
        'typing.wav': generate_typing_sound(),
        'beep.wav': generate_beep_sound(),
        'power-on.wav': generate_power_on_sound(),
        'power-off.wav': generate_power_off_sound(),
        'static.wav': generate_static_sound()
    }
    
    print("Generating real sound effects...")
    
    for filename, data in sounds.items():
        filepath = os.path.join(sounds_dir, filename)
        create_wav_file(filepath, data)
        print(f"Created: {filepath}")
    
    print("\nAll sounds generated as WAV files!")
    print("\nTo convert to MP3, you can use ffmpeg:")
    print("for f in assets/sounds/*.wav; do ffmpeg -i \"$f\" \"${f%.wav}.mp3\" -y; done")
    print("\nOr use an online converter like cloudconvert.com")