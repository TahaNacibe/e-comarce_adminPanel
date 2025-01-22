

export default function FirstLetterToCapital({word}:{word:string}) {
    return word[0].toUpperCase() + word.slice(1)
   
}