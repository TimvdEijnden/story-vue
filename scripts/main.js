const cloudFunction = 'https://europe-west1-realtime-story.cloudfunctions.net/addSentence';

const storyApp = new Vue({
    el: '#app',
    filters: {
        formatSentence(val) {
            if(!val) return;
            var newText = val;
            if(['.','!','?',','].indexOf(newText.substr(-1)) == -1){
                newText += '.';
            }
            newText = newText.substr(0,1).toUpperCase() + newText.substr(1);
            return newText;
        }
    },
    data: {
        sentences : []
    },
    methods: {
        addSentence(e){
            e.preventDefault();
            if(this.$data.sentence_text.trim().length > 10){
                const sentence = {author: this.$data.sentence_author, text: this.$data.sentence_text.trim() }
                this.$data.sentence_text= "";
                fetch(cloudFunction, {
                    method: 'post',
                    body: JSON.stringify(sentence),
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }).catch((error) => {
                    alert(`Something went wrong: ${error}.`);
                });
            }else{
                alert('Please write a correct sentence');
            }
        }
    }
});
const db = firebase.database();
const Sentences = db.ref('sentences');

Sentences.on('child_added', (snapshot) => {
    var item = snapshot.val();
    item.id = snapshot.key;
    storyApp.sentences.push(item);
})

Sentences.on('child_removed',(snapshot) => {
    var id = snapshot.key();
    storyApp.sentences.some(sentence => {
        if (sentence.id === id) {
            storyApp.sentences.remove(sentence)
            return true
        }
    })
})