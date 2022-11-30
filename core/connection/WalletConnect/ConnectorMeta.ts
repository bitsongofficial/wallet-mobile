import { makeAutoObservable } from "mobx";

export class ConnectorMeta {
	name = ""
	date: Date | null = null
	icon = ""
	url = ""
	description = ""

	constructor()
	{
		makeAutoObservable(this, {}, {autoBind: true})
	}

	setDate(date: Date)
	{
		this.date = date
	}

	setName(name: string)
	{
		this.name = name
	}

	setUrl(url: string)
	{
		this.url = url
	}

	setIcon(icon: string)
	{
		this.icon = icon
	}

	setDescription(description: string)
	{
		this.description = description
	}
}