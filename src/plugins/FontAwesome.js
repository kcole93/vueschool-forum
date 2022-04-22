import { library } from '@fortawesome/fontawesome-svg-core'
import { faPenToSquare, faXmarkSquare } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

library.add(faPenToSquare, faXmarkSquare)

export default (app) => {
    app.component('faIcon', FontAwesomeIcon)
}