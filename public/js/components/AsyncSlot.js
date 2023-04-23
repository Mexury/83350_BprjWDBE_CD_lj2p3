class AsyncSlot extends HTMLElement {

    static get observedAttributes() {
        return [
            'src',
            'method',
            'refetch-on-change',
            'refetch-timer'
        ]
    }

    #timer
    #attributes = []

    // fetchStartEvent = new CustomEvent('fetch-start', { composed: true })
    // fetchFailureEvent = new CustomEvent('fetch-failure', { composed: true })
    // fetchSuccessEvent = new CustomEvent('fetch-success', { composed: true })

    constructor() {
        super()

        // functionality
        this.attachShadow({ mode: "open" })
        
        const slot = document.createElement("slot")
        this.shadowRoot.append(slot)
    }

    #clearShadowRoot() {
        while (this.shadowRoot.lastChild) {
            this.shadowRoot.lastChild.remove()
        }
    }

    #updateAttributes() {
        this.#attributes = []
        for (const attribute of this.attributes) {
            this.#attributes[attribute.name] = attribute.value
        }
    }

    async update() {
        // this.#clearShadowRoot()
        this.#fetchData()
    }

    async #fetchData() {
        let [
            // method,
            source
        ] = [
            // this.#attributes['method'],
            this.#attributes['src'],
        ]

        if (source) {
            this.setAttribute('is-fetching', true)
            this.#updateAttributes()
            let result = 'Unable to load...'

            await fetch(source)
            .then(async res => {
                result = (res.status >= 400 && res.status < 600) ? 'Bad response from server' : await res.text()
            })
            .catch(error => {
                result = error
            })

            this.#clearShadowRoot()
            this.shadowRoot.innerHTML = result
            
            this.setAttribute('is-fetching', false)
            this.#updateAttributes()

            let scripts = this.shadowRoot.querySelectorAll("script")
            scripts.forEach(script => eval(script.textContent))
        }
    }

    connectedCallback() {
        if (this.isConnected) {
            // added to page
            this.#updateAttributes()
            this.#fetchData()

            let timer = this.#attributes['refetch-timer']
            if (timer) timer = parseInt(timer)
            if (!isNaN(timer)) {
                this.#timer = setInterval(() => this.update(), timer)
            }
        }
    }

    disconnectedCallback() {
        // removed from page
        if (this.#timer) clearTimeout(this.#timer)
    }

    attributeChangedCallback() {
        // attribute changed
        if (this.isConnected) {
            this.#updateAttributes()
            if (this.#attributes['refetch-on-change'] == 'true') {
                console.log('Casting refetch...')
                this.#fetchData()
                
                let timer = this.#attributes['refetch-timer']
                
                if (this.#timer) clearInterval(this.#timer)
                if (timer) timer = parseInt(timer)
                if (!isNaN(timer)) {
                    this.#timer = setInterval(() => this.update(), timer)
                }
            }
        }
    }
}

customElements.define("async-slot", AsyncSlot)