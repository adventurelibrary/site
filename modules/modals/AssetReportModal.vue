<template>   
	<div>
        <h1>Report</h1>        

        Report category:
        <select v-model='reportCategory'>
            <option v-for="option in options" v-bind:key="option.value">
                some text
                {{ option.text }}
            </option>
        </select>

        <!-- only display name and contact email if user is not logged in, otherwise use logged in details -->
        Name:
        <input v-model="name" placeholder="Your name.">        

        Contact email:
        <input v-model="email" placeholder="Your email address.">        

        Message:
        <textarea v-model="message" placeholder="Leave your message here."></textarea>

        <button v-on:click="sendReport()">Send Report</button>
	</div>
</template>

<script lang="ts">
import {Component, Prop, Getter, State} from "nuxt-property-decorator";
import {User} from "~/lib/users/user-types"
import {Asset} from "~/lib/assets/asset-types";
import { options } from "less";
import {reportAsset} from "~/lib/assets/asset-api";
import Vue from "vue";

@Component({
	components: {
		//asset: Asset
        // reportCategory: 

	}
})


export default class ReportAssetModal extends Vue {
	@State('user') user : User  
    @Getter('isLoggedIn') isLoggedIn : boolean
    @State('reporteAsset') asset : Asset

    // add user name and id if logged in
    userName = ({
        el: 'name',
        data: {
            value: 'no value at start'
        }
    }) 

    
    el: {   

    }
    
    data : {
        reportCategory: '',
        options: [
            {text: 'Inappropriate content', value: 'Inappropriate content'},
            {text: 'Low quality', value: 'Low quality'},
            {text: 'Misleading product description', value: 'Misleading product description'},
            {text: 'Stolen content', value: 'Stolen content'},
            {text: 'Other', value: 'Other'}            
        ],
        name: '',
        email: '',
        message: ''

    }

	closeModal () {
		this.$store.dispatch('closeAllModals')
        
	}



	// handles archiving of the asset
	async sendReport () {
		try {
			await reportAsset(this.asset.id, this.asset.name, this.data.reportCategory, this.data.name, this.data.email, this.data.message)
			this.closeModal()

			// send message for user
			//this.$store.dispatch('notifySuccess', "Asset deleted successfully.")	
			this.notifySuccess("Asset " + this.asset.name + " was reported successfully.")			
		}
		catch (ex) {
			console.log('ex ', ex)
			this.notifyError(ex.toString())
		}
	}    
}




</script>
