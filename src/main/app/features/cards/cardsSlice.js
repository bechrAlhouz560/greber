import {
    createSlice
} from "@reduxjs/toolkit";



const cardsSlice = createSlice({
    name: 'cards',
    // test state 
    // {
    //     id: 123,
    //     list_id: 123,
    //     name: "My card Name"
    // }
    initialState: [],
    reducers: {
        addCard: function (state, action) {
            let card = action.payload;
            return [
                ...state, card
            ]
        },
        removeCard : function (state,action) {
            let card = action.payload;
            return state.filter(function (_card) { 
                if (card.id !== _card.id)
                {
                    return _card;
                }
            }) 
        },
        editCard: function (state,action) { 
            let editedCard = action.payload;
            let cards = state.filter(function (card) {
                if (card.id !== editedCard.id)
                {
                    return card
                }
            })
            
            return [
                ...cards,editedCard
            ]
        },
        init : function (state,action) { 
            return action.payload;
        }
    }
})

export default cardsSlice