import { makeAutoObservable } from "mobx";

export type contact = {
	name: string,
	address: string,
	avatar: string,
	starred: boolean,
}

type contactIndexer = contact | number | string

export default class ContactsStore {
	contacts: contact[] = []

	constructor() {
		makeAutoObservable(this, {}, { autoBind: true })
	}

	addContact(contact: contact)
	{
		if(!this.contacts.find(c => c.address == contact.address)) this.contacts.push(contact)
	}

	private resolveContact(indexer: contactIndexer)
	{
		if(typeof indexer == "string") return this.contacts.find(c => c.address == indexer)
		if(typeof indexer == "number") return this.contacts[indexer]
		return this.contacts.find(c => c == indexer)
	}

	removeContact(contact: contactIndexer)
	{
		const actualContact = this.resolveContact(contact)
		if(actualContact) this.contacts.splice(this.contacts.indexOf(actualContact), 1)		
	}

	editName(contact: contactIndexer, name:string)
	{
		const actualContact = this.resolveContact(contact)
		if(actualContact) actualContact.name = name
	}

	editAddress(contact: contactIndexer, address:string)
	{
		const actualContact = this.resolveContact(contact)
		if(actualContact) actualContact.address = address
	}

	editAvatar(contact: contactIndexer, uri:string)
	{
		const actualContact = this.resolveContact(contact)
		if(actualContact) actualContact.avatar = uri
	}
}
