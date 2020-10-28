<template>
<v-container>
<v-layout xs12 pl-2>
    <v-flex xs12 sm6 md6 lg6>
    <v-card>
        <v-img
        class="white--text"
        height="400"
        :src="image.url">
        </v-img>
        <v-card-title>
        <div>
            <span class="grey--text">{{image.name}}</span>
            <v-chip :color= "selectClass(image.scorePromedio)"> {{image.scorePromedio | trimScore }}
            </v-chip>
            <br>
            <span>{{image.labels | separateLabels }}</span>
        </div>
        </v-card-title>
    </v-card>
    </v-flex>
</v-layout>
<v-layout>
    <v-flex xs12>
    <v-text-field label="Que te parece esta foto"
        v-model="comentario">
    </v-text-field>
    <v-layout>
        <v-layout>
            <v-flex xs12 pt-5>
            <v-btn primary @click="enviarComentario">
            Enviar
            </v-btn>
        </v-flex>
        </v-layout>
        <v-flex xs12 pt-5 ml-5> 
        <h1>Otros comentarios</h1>
        </v-flex>
    </v-layout>
    <v-layout v-for="comentario in comentarios" v-bind:key="comentario.id">
        <v-flex xs12>
        <v-text-field
            :value="comentario.texto"
            :label="comentario.score +''"
            readonly
        ></v-text-field>

        </v-flex>
    </v-layout>
    </v-flex>
</v-layout>
</v-container>
</template>


<script>  
import { firestore } from'@/main'
//import { storage } from '@/main'
import axios from'axios' //para hacer una petición http a un API-REST

export default {
name: 'ImageDetail',
data() {
    return{
    apiKey: "tu api key",
    id: this.$route.params.id,
    image: '',
    comentario: '',
    comentarios: []
    }      
},
methods:{
    enviarComentario: function(){
    const data={
        "document":{
        "type": "PLAIN_TEXT",
        "language":"ES",
        "content": this.comentario
        },
        "encodingType": "UTF8"
    }

    axios.post(`https://language.googleapis.com/v1/documents:analyzeSentiment?key=${this.apiKey}`, data)
    .then(response => {
        const score = response.data.documentSentiment.score
    let comentario = {
        imageId: this.id,
        texto: this.comentario,
        createdAt: (+new Date()),
        score: score  
    }
    firestore.collection('comentarios').add(comentario).then(() =>{
        const length = this.comentarios.length
        let scorePromedio = 0
        this.comentarios.forEach(function(comentario){
            scorePromedio = scorePromedio + comentario.score
            
        })
        scorePromedio = scorePromedio / length
        firestore.collection('images').doc(this.id).set({
            scorePromedio : scorePromedio
        },{merge : true})
        this.comentario = ''
        })
    })
    },
    selectClass: function(score){
    if( score < - 0.25) {
        return 'red'
    }else if (score >= -0.25 && score < 0.25) {
        return 'warning'
    } else {
        return 'success'
    }
    }
},
firestore(){
    return{
    image: firestore.collection('images').doc(this.id),
    comentarios: firestore.collection('comentarios').where("imageId", "==", this.id)
    }
},
filters: {
    //muestra las caractetisticas detectadas por google vision
    separateLabels: function (value) {
    return `${value[0]},${value[1]},${value[2]}`
    },
    trimScore: function (value) {
    return Number(value.toString().slice(0,5))
    }
}
}
</script>