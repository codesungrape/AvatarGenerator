<template>
    <div class="creature-generator">
        <!-- Decorative elements -->
        <div class="energy-pulse"></div>
        <div class="energy-pulse"></div>
        <div class="energy-pulse"></div>
        <div class="energy-pulse"></div>
  
        <div class="header-container">
            <h1>Who You Were Meant To Be</h1>
            <h2>Craft Your Ultimate Avatar, describe your vision and witness it materialize.</h2>
        </div>
    
        <div class="container">
            <div class="input-section">
            <textarea v-model="prompt" placeholder="Create your alter ego! Try: 'A secret agent in a tuxedo with futuristic glasses and a sleek hoverboard.'"></textarea>
            <button @click="generateAvatar" >Create Your Legend</button>
            
            <div class="loading" v-show="isLoading">
                <div></div>
                <div></div>
                <div></div>
            </div>
            </div>
    
            <div class="image-container">
            <div class="frame">
                <div v-if="!imageUrl" class="empty-frame">
                    <h3>Your creation will manifest here</h3>
                </div>
                <!-- <img src="path-to-generated-image.jpg" alt="Generated creature"> -->
                <img v-if="imageUrl" :src="imageUrl" alt="Generated avatar">
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { OpenAI } from 'openai';

    export default defineComponent({
        name: 'AvatarGenerator',
        setup() {
            // Declare variables
            const prompt = ref('');
            const isLoading = ref(false);
            const imageUrl = ref('');
            const errorMessage = ref('');
            const loadingMessage = ref('');
            const apiKey = import.meta.env.VITE_OPENAI_API_KEY;

            // Initialize OpenAI
            const openai = new OpenAI({
                apiKey: apiKey,
                dangerouslyAllowBrowser: true
            })

            // logic to toggle loading
            function toggleLoadingState(loading: boolean) {
                isLoading.value = loading;
                if (loading) {
                    loadingMessage.value = 'Creating your avatar...'
                } else {
                    loadingMessage.value = "";
                }
            }

            // Generate creature image using OpenAI DALL-E
            const generateAvatar = async () => {
                if (!prompt.value.trim()) {
                    alert("Please describe your creature first!");
                    return;
                }
            // Show loading state
            toggleLoadingState(true);

            try {
                // Enhance prompt output
                const enhancedPrompt = `Create a visually striking, fantastical creation: ${prompt.value}. Make it highly detailed, dramatic, with vibrant colors and impressive features while still maintaining a friendly appearance.`

                // Call OpenAI API
                const response = await openai.images.generate({
                    model: 'dall-e-3',
                    prompt: enhancedPrompt,
                    n: 1,
                    size: "1024x1024",
                    style: 'vivid'
                })

                // Check if URL exists before assigning
                // Check if URL exists before assigning
                if (response.data[0]?.url) {
                    imageUrl.value = response.data[0].url;
                    errorMessage.value = ''; // Clear any previous errors
                } else {
                    errorMessage.value = "No image URL was returned";
                }

                console.log("Image created successfully");
            } catch (error: any) {
                console.error('Error generating image:', error);
                errorMessage.value = error.message;
            } finally {
                // Reset loading state
                toggleLoadingState(false);
                prompt.value = '';
            }
            }

            // Return data and methods
            return {
                prompt,
                isLoading,
                imageUrl,
                errorMessage,
                loadingMessage,
                generateAvatar
            };
        }
    })
</script>
<style>
@import url('https://fonts.googleapis.com/css2?family=Honk&family=Roboto+Mono:ital,wght@0,100..700;1,100..700&family=Roboto:ital,wght@0,100;0,300;0,400;0,500;0,700;0,900;1,100;1,300;1,400;1,500;1,700;1,900&family=Source+Sans+3:ital,wght@0,200..900;1,200..900&display=swap');

/* Base styles */
.creature-generator {
  font-family: 'Montserrat', 'Helvetica Neue', Arial, sans-serif;
  color: #e0e0e0;
  line-height: 1.6;
  display: flex;
  flex-direction: column;
  align-items: center;
  background-image: linear-gradient(160deg, #13111c 0%, #221b2e 100%);
  min-height: 100vh;
  padding: 0;
  margin: 0;
  width: 100%;
  position: relative;
  overflow-x: hidden;
  box-sizing: border-box;
}

/* Common container styles */
.header-container, .input-section, .frame {
  border-radius: 12px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
  transition: transform 0.3s, box-shadow 0.3s;
}

/* Header styles - FULL WIDTH MODIFICATION */
.header-container {
  padding: clamp(20px, 5vw, 40px);
  width: 95%; /* Increased from 90% */
  max-width: 1200px; /* Increased from 800px */
  margin: 20px auto; /* Reduced top margin */
  background: linear-gradient(-45deg, #ff9a9e, #f2a1e2, #a18cd1, #fbc2eb, #ffb347);
  background-size: 400% 400%;
  animation: headerGradient 15s ease infinite;
  border: none;
}

.header-container h1, .header-container h2 {
  margin: 0;
}

/* Typography */
h1 {
  font-family: 'Honk', sans-serif;
  font-weight: 800;
  font-size: clamp(2.9rem, 5vw, 2.5rem);
  margin-top: 30px;
  margin-bottom: 10px;
  text-align: center;
  letter-spacing: 1px;
  color: #ffffff;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.4);
  background-clip: text;
  -webkit-background-clip: text;
}

h2 {
  font-size: clamp(0.9rem, 3vw, 1.1rem);
  font-weight: 700;
  color: #ffffff;
  margin: 0 auto 30px;
  max-width: 800px; /* Increased from 600px */
  text-align: center;
  line-height: 1.5;
  opacity: 0.85;
  padding-top: 15px;
}

/* Container for the main content - FULL WIDTH MODIFICATION */
.container {
  width: 95%; /* Increased from 90% */
  max-width: 1200px; /* Increased from 800px */
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: clamp(10px, 2vw, 15px); /* Reduced padding */
  margin: 0 auto;
  animation: fadeIn 0.5s ease-out forwards;
}

/* Input section */
.input-section {
  width: 100%;
  padding: clamp(15px, 4vw, 25px);
  margin-bottom: 30px;
  animation: fadeIn 0.5s ease-out 0.1s forwards;
  opacity: 0;
  background-color: rgba(30, 25, 45, 0.8);
  border: 1px solid rgba(161, 140, 209, 0.3);
  backdrop-filter: blur(5px);
}

.input-section:focus-within {
  box-shadow: 0 15px 35px rgba(161, 140, 209, 0.4);
  transform: translateY(-2px);
  border: 1px solid rgba(161, 140, 209, 0.6);
}

/* Form elements */
textarea {
  width: 100%;
  min-height: clamp(80px, 15vh, 120px);
  padding: 15px;
  border: 1px solid rgba(161, 140, 209, 0.5);
  border-radius: 8px;
  font-size: clamp(0.9rem, 2vw, 1rem);
  resize: vertical;
  box-sizing: border-box;
  transition: border-color 0.3s, box-shadow 0.3s;
  font-family: inherit;
  background-color: rgba(30, 25, 45, 0.6);
  color: #e0e0e0;
}

textarea:focus {
  outline: none;
  border-color: #a18cd1;
  box-shadow: 0 0 0 3px rgba(161, 140, 209, 0.2);
}

textarea::placeholder {
  color: rgba(161, 140, 209, 0.6);
}

/* Button styles */
button {
  background: linear-gradient(45deg, #a18cd1 0%, #fbc2eb 100%);
  color: white;
  border: none;
  border-radius: 8px;
  padding: clamp(12px, 3vw, 15px) clamp(20px, 5vw, 30px);
  font-family: 'Honk', sans-serif;
  font-weight: 800;
  font-size: clamp(1.5rem, 2vw, 1.1rem);
  cursor: pointer;
  margin-top: 20px;
  transition: all 0.3s ease;
  width: 100%;
  letter-spacing: 0.5px;
  text-transform: uppercase;
  position: relative;
  overflow: hidden;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
}

button:hover {
  background: linear-gradient(45deg, #8a76b5 0%, #faa7e0 100%);
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(161, 140, 209, 0.5);
}

button:active {
  transform: translateY(0);
}

/* Button ripple effect */
button::after {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 5px;
  height: 5px;
  background: rgba(255, 255, 255, 0.5);
  opacity: 0;
  border-radius: 100%;
  transform: scale(1, 1) translate(-50%);
  transform-origin: 50% 50%;
}

button:focus:not(:active)::after {
  animation: ripple 1s ease-out;
}

/* Output section - image frame - MODIFIED FOR BETTER LAYOUT */
.image-container {
  width: 100%;
  display: flex;
  justify-content: center;
  margin-top: 20px;
  animation: fadeIn 0.5s ease-out 0.2s forwards;
  opacity: 0;
}

.frame {
  padding: clamp(10px, 3vw, 15px);
  text-align: center;
  width: 100%;
  max-width: 500px; /* Increased from 400px */
  background-color: rgba(30, 25, 45, 0.8);
  border: 1px solid rgba(161, 140, 209, 0.3);
  backdrop-filter: blur(5px);
}

.frame:hover {
  transform: scale(1.02);
  box-shadow: 0 15px 40px rgba(161, 140, 209, 0.5);
  border: 1px solid rgba(161, 140, 209, 0.6);
}

.frame img {
  width: 100%;
  height: auto;
  border-radius: 8px;
  display: block;
  object-fit: cover;
}

.empty-frame {
  height: clamp(250px, 50vw, 350px);
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(25, 20, 35, 0.7);
  border-radius: 8px;
  border: 1px dashed rgba(161, 140, 209, 0.5);
}

.empty-frame h3 {
  color: rgba(161, 140, 209, 0.8);
  font-size: clamp(1rem, 3vw, 1.2rem);
  font-weight: 400;
  padding: 0 20px;
  text-align: center;
}

/* Loading indicator */
.loading {
  margin: 20px 0;
  text-align: center;
}

.loading div {
  width: clamp(10px, 3vw, 16px);
  height: clamp(10px, 3vw, 16px);
  background: linear-gradient(45deg, #a18cd1 0%, #fbc2eb 100%);
  border-radius: 50%;
  display: inline-block;
  margin: 0 5px;
  animation: bounce 1.4s infinite ease-in-out both;
}

.loading div:nth-child(1) {
  animation-delay: -0.32s;
}

.loading div:nth-child(2) {
  animation-delay: -0.16s;
}

/* Decorative elements - energy pulses with new colors */
.energy-pulse {
  position: absolute;
  border-radius: 50%;
  opacity: 0;
  animation: pulse 4s infinite;
  pointer-events: none;
  z-index: 0;
}

.energy-pulse:nth-child(1) {
  top: 15%;
  left: 5%; /* Moved closer to edge */
  width: clamp(100px, 15vw, 150px);
  height: clamp(100px, 15vw, 150px);
  background: radial-gradient(circle, rgba(251, 194, 235, 0.6) 0%, rgba(251, 194, 235, 0) 70%);
}

.energy-pulse:nth-child(2) {
  top: 30%;
  right: 5%; /* Moved closer to edge */
  width: clamp(120px, 20vw, 200px);
  height: clamp(120px, 20vw, 200px);
  animation-delay: 1s;
  background: radial-gradient(circle, rgba(161, 140, 209, 0.6) 0%, rgba(161, 140, 209, 0) 70%);
}

.energy-pulse:nth-child(3) {
  bottom: 25%;
  left: 2%; /* Moved closer to edge */
  width: clamp(100px, 18vw, 180px);
  height: clamp(100px, 18vw, 180px);
  animation-delay: 2s;
  background: radial-gradient(circle, rgba(255, 179, 71, 0.6) 0%, rgba(255, 179, 71, 0) 70%);
}

.energy-pulse:nth-child(4) {
  bottom: 10%;
  right: 2%; /* Moved closer to edge */
  width: clamp(80px, 12vw, 120px);
  height: clamp(80px, 12vw, 120px);
  animation-delay: 3s;
  background: radial-gradient(circle, rgba(255, 154, 158, 0.6) 0%, rgba(255, 154, 158, 0) 70%);
}

/* Error container */
.error-container {
  padding: 20px;
  color: #ff6b6b;
  text-align: center;
  background-color: rgba(255, 107, 107, 0.1);
  border-radius: 8px;
  margin: 20px 0;
  max-width: 100%;
  border: 1px solid rgba(255, 107, 107, 0.3);
  backdrop-filter: blur(5px);
}

.error-container small {
  display: block;
  margin-top: 10px;
  opacity: 0.7;
}

/* Save button style */
.save-button {
  margin-top: 15px;
  padding: clamp(8px, 2vw, 10px) clamp(15px, 4vw, 20px);
  font-size: clamp(0.8rem, 2vw, 0.9rem);
  background: linear-gradient(45deg, #a18cd1 30%, #fbc2eb 100%);
  border: none;
  width: auto;
  display: inline-block;
  opacity: 0.9;
}

.save-button:hover {
  background: linear-gradient(45deg, #8a76b5 0%, #faa7e0 100%);
  opacity: 1;
}

/* Media query for larger screens - NEW */
@media (min-width: 1400px) {
  .container, .header-container {
    max-width: 90%; /* Even wider on very large screens */
  }
}

/* Media query for small screens */
@media (max-width: 350px) {
  .container, .header-container {
    width: 98%; /* Almost full width on small screens */
    padding: 5px;
  }
  
  .input-section, textarea, button {
    padding: 10px;
  }
}

/* Dark mode optimization */
@media (prefers-color-scheme: dark) {
  .creature-generator {
    background-image: linear-gradient(160deg, #0e0c16 0%, #1a1526 100%);
  }
  
  .input-section, .frame {
    background-color: rgba(25, 20, 35, 0.8);
  }
  
  textarea {
    background-color: rgba(20, 15, 30, 0.8);
  }
  
  .empty-frame {
    background-color: rgba(20, 15, 30, 0.7);
  }
}

/* Animations */
@keyframes headerGradient {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes ripple {
  0% {
    transform: scale(0, 0);
    opacity: 0.5;
  }
  100% {
    transform: scale(30, 30);
    opacity: 0;
  }
}

@keyframes bounce {
  0%, 80%, 100% { transform: scale(0); }
  40% { transform: scale(1.0); }
}

@keyframes pulse {
  0% { transform: scale(0.8); opacity: 0; }
  50% { opacity: 0.2; }
  100% { transform: scale(1.2); opacity: 0; }
}

</style>