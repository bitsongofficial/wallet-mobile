import { makeAutoObservable, runInAction, set } from "mobx";

export type Contact = {
	name: string,
	address: string,
	avatar?: string,
	starred?: boolean,
}

type contactIndexer = Contact | number | string

export default class ContactsStore {
	contacts: Contact[] = []

	constructor() {
		makeAutoObservable(this, {}, { autoBind: true })
	}

	addContact(contact: Contact)
	{
		const actualContact = Object.assign({starred: false}, contact)
		if(!this.contacts.find(c => c.address == actualContact.address)) this.contacts.push(actualContact)
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
		if(actualContact) set(actualContact, {name})
	}

	editAddress(contact: contactIndexer, address:string)
	{
		const actualContact = this.resolveContact(contact)
		if(actualContact) set(actualContact, {address})
	}

	editAvatar(contact: contactIndexer, uri:string)
	{
		const actualContact = this.resolveContact(contact)
		if(actualContact) set(actualContact, {avatar: uri})
	}

	toggleStarred(contact: contactIndexer)
	{
		const actualContact = this.resolveContact(contact)
		if(actualContact) set(actualContact, {starred: !actualContact.starred})
	}

	get starred() {
		return this.contacts.filter(c => c.starred)
	}

	filterContacts(filter?: string) {
		const { contacts } = this;
		if (filter)
		{
			const lowerCase = filter.toLowerCase();
			return contacts.filter(({ name }) =>
				name.toLowerCase().includes(lowerCase)
			);
		} else {
			return contacts;
		}
	}

	labelContacts(contacts: Contact[], filter?: string)
	{
		type ContactsSection = {
			label: string,
			data: Contact[],
		}

		const { starred } = this

		const filterdPersons = this.filterContacts(filter)

		const favoritesData: ContactsSection = {
			label: "Favorite",
			data: filterdPersons.filter((person) => starred.find(s => s.address == person.address)),
		}

		const records = filterdPersons.reduce((records, person) =>
		{
			const key = person.name[0].toUpperCase()

			if (records[key])
			{
				records[key].push(person)
			}
			else
			{
				records[key] = [person]
			}

			return records
		}, {} as { [key: string]: Contact[] })

		const allData: ContactsSection[] = Object.keys(records)
		.sort()
		.map((key) => (
		{
			label: key,
			data: records[key],
		}))

		return favoritesData.data.length > 0
		? [favoritesData, ...allData]
		: allData
	}
}