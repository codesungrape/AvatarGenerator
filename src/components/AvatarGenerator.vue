<template>
    <div class="creature-generator">
        <!-- Decorative elements -->
        <div class="energy-pulse"></div>
        <div class="energy-pulse"></div>
        <div class="energy-pulse"></div>
        <div class="energy-pulse"></div>
  
        <h1>Who You Were Meant To Be</h1>
        <h2>Craft Your Ultimate Avatar, describe your vision and witness it materialize.</h2>
    
        <div class="container">
            <div class="input-section">
            <textarea v-model="prompt" placeholder="A majestic dragon with obsidian scales and ethereal purple flames..."></textarea>
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

<style lang="scss" scoped>
   .creature-generator {
  /* Replace the html, body styling */
  font-family: 'Montserrat', 'Helvetica Neue', Arial, sans-serif;
  color: #2c2c2c;
  line-height: 1.6;
  display: flex;
  flex-direction: column;
  align-items: center;
  background-image: linear-gradient(160deg, #1a1a1a 0%, #333333 100%);
  min-height: 100vh;
  padding: 0 20px;
  margin: 0;
  width: 100%;
  position: relative; /* For absolute positioning of energy pulses */
}
  
  /* Typography */
  h1 {
    font-size: 2.5rem;
    font-weight: 700;
    color: #e0e0e0;
    margin-top: 50px;
    margin-bottom: 10px;
    text-align: center;
    letter-spacing: 1px;
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
  }
  
  h2 {
    font-size: 1.1rem;
    font-weight: 400;
    color: #b0b0b0;
    margin: 0 auto 30px;
    max-width: 600px;
    text-align: center;
    line-height: 1.5;
  }
  
  /* Container for the main content */
  .container {
    width: 100%;
    max-width: 800px;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 20px;
  }
  
  /* Input section */
  .input-section {
    width: 100%;
    max-width: 600px;
    background-color: #222222;
    border-radius: 8px;
    padding: 25px;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.25);
    margin-bottom: 30px;
    border: 1px solid #444444;
  }
  
  textarea {
    width: 100%;
    min-height: 100px;
    padding: 15px;
    border: 1px solid #444444;
    border-radius: 6px;
    font-size: 1rem;
    resize: vertical;
    box-sizing: border-box;
    transition: border-color 0.3s;
    font-family: inherit;
    background-color: #333333;
    color: #e0e0e0;
  }
  
  textarea:focus {
    outline: none;
    border-color: #7b68ee;
    box-shadow: 0 0 0 3px rgba(123, 104, 238, 0.2);
  }
  
  textarea::placeholder {
    color: #777777;
  }
  
  button {
    background-color: #7b68ee;
    color: white;
    border: none;
    border-radius: 6px;
    padding: 15px 30px;
    font-size: 1.1rem;
    font-weight: 600;
    cursor: pointer;
    margin-top: 20px;
    transition: all 0.3s ease;
    width: 100%;
    letter-spacing: 0.5px;
    text-transform: uppercase;
  }
  
  button:hover {
    background-color: #6a5acd;
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(123, 104, 238, 0.4);
  }
  
  button:active {
    transform: translateY(0);
  }
  
  /* Output section - image frame */
  .image-container {
    width: 100%;
    display: flex;
    justify-content: center;
    margin-top: 20px;
  }
  
  .frame {
    background-color: #222222;
    border-radius: 8px;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
    padding: 15px;
    box-sizing: border-box;
    position: relative;
    text-align: center;
    width: 100%;
    max-width: 400px;
    transition: transform 0.3s;
    border: 1px solid #444444;
  }
  
  .frame:hover {
    transform: scale(1.02);
    box-shadow: 0 15px 40px rgba(0, 0, 0, 0.4);
  }
  
  .frame img {
    width: 100%;
    border-radius: 6px;
    display: block;
  }
  
  .empty-frame {
    height: 350px;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #2a2a2a;
    border-radius: 6px;
    border: 1px dashed #444444;
  }
  
  .empty-frame h3 {
    color: #777777;
    font-size: 1.2rem;
    font-weight: 400;
  }
  
  /* Loading indicator */
  .loading {
  margin: 20px 0;
  text-align: center; /* Added for better centering */
}
  
  .loading div {
    width: 16px;
    height: 16px;
    background-color: #7b68ee;
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
  
  @keyframes bounce {
    0%, 80%, 100% { transform: scale(0); }
    40% { transform: scale(1.0); }
  }
  
  /* Responsive adjustments */
  @media (max-width: 768px) {
    h1 {
      font-size: 2rem;
    }
    
    .input-section {
      padding: 20px;
    }
    
    textarea {
      min-height: 80px;
    }
  }
  
  @media (max-width: 480px) {
    h1 {
      font-size: 1.8rem;
      margin-top: 20px;
    }
    
    h2 {
      font-size: 1rem;
    }
    
    .input-section {
      padding: 15px;
    }
    
    button {
      padding: 12px 20px;
      font-size: 1rem;
    }
  }
  
  /* Decorative elements - energy pulses instead of sparkles */
  .energy-pulse {
    position: absolute;
    background: radial-gradient(circle, rgba(123, 104, 238, 0.8) 0%, rgba(123, 104, 238, 0) 70%);
    border-radius: 50%;
    opacity: 0;
    animation: pulse 4s infinite;
  }
  
  .energy-pulse:nth-child(1) {
    top: 15%;
    left: 20%;
    width: 150px;
    height: 150px;
    animation-delay: 0s;
  }
  
  .energy-pulse:nth-child(2) {
    top: 30%;
    right: 15%;
    width: 200px;
    height: 200px;
    animation-delay: 1s;
  }
  
  .energy-pulse:nth-child(3) {
    bottom: 25%;
    left: 15%;
    width: 180px;
    height: 180px;
    animation-delay: 2s;
  }
  
  .energy-pulse:nth-child(4) {
    bottom: 10%;
    right: 20%;
    width: 120px;
    height: 120px;
    animation-delay: 3s;
  }
  
  @keyframes pulse {
    0% { transform: scale(0.8); opacity: 0; }
    50% { opacity: 0.2; }
    100% { transform: scale(1.2); opacity: 0; }
  }
  
  /* Error container */
  .error-container {
    padding: 20px;
    color: #ff6b6b;
    text-align: center;
  }
  
  .error-container small {
    display: block;
    margin-top: 10px;
    opacity: 0.7;
  }
  
  /* Save button style */
  .save-button {
    margin-top: 15px;
    padding: 10px 20px;
    font-size: 0.9rem;
    background-color: #444444;
    border: 1px solid #666666;
  }
  
  .save-button:hover {
    background-color: #555555;
  }


</style>