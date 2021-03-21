// For any extra functionality that our mixins add to the Vue object
// we have to add the definition here, otherwise TypeScript won't know
// that our classes that extend Vue have these functions
// So anything global, we have to add here

declare module 'vue/types/vue' {
	interface Vue {
		notifySuccess (arg: string) : void
		notifyError (arg: string) : void
	}
}
