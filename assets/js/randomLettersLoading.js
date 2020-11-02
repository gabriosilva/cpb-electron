function getRandomLetterFromAlphabet(){
    const alphabet = "abcdefghijklmnopqrstuvwxiz".toUpperCase();

    return alphabet[Math.floor(Math.random() * alphabet.length)];
};
