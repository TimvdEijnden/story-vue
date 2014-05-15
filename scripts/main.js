var storyApp = new Vue({
    el: '#app',
    filters: {
        formatSentence: function (val) {
            if(!val) return;
            var newText = val;
            if(['.','!','?',','].indexOf(newText.substr(-1)) == -1){
                newText += '.';
            }
            newText += ' ';
            newText = newText.substr(0,1).toUpperCase() + newText.substr(1);
            return newText;
        }
    },
    data: {
        sentences : []
    },
    methods: {
        addSentence: function(e){
            e.preventDefault();
            if(this.$data.sentence_text.trim().length > 10){
                Sentences.push({author: this.$data.sentence_author, text: this.$data.sentence_text.trim() });
                this.$data.sentence_text= "";
            }else{
                alert('Please write a correct sentence');
            }  
        }
    }
});

var Sentences = new Firebase("https://burning-fire-5298.firebaseio.com");

Sentences.on('child_added', function (snapshot) {
    var item = snapshot.val();
    item.id = snapshot.name();
    storyApp.sentences.push(item);
})

Sentences.on('child_removed', function (snapshot) {
    var id = snapshot.name();
    storyApp.sentences.some(function (sentence) {
        if (sentence.id === id) {
            storyApp.sentences.remove(sentence)
            return true
        }
    })
})