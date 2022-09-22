import { csrfFetch } from "./csrf";

const GET_EVENTS = 'events/getAllEvents'
const GET_SINGLE_EVENT = 'events/getEventById'
const CREATE_EVENT = 'events/createEvent'

const populateEvents = (events) => {
  return {
    type: GET_EVENTS,
    events
  }
}

const populateSingleEvent = (event) => {
  return {
    type: GET_SINGLE_EVENT,
    event
  }
}

const createEvent = (newEvent) => {
  return {
    type: CREATE_EVENT,
    newEvent
  }
}

export const getEvents = () => async (dispatch) => {
  const response = await csrfFetch('/api/events')
  if (response.ok){
    const data = await response.json();
  dispatch(populateEvents(data));
  return data
  };
};

export const getEventById = (id) => async (dispatch) => {
  const response = await csrfFetch(`/api/events/${id}`)
  if (response.ok){
    const data = await response.json();
    dispatch(populateSingleEvent(data));
    return data
  }
};

export const eventCreator = (body, groupId) => async (dispatch) => {
  const {venueId, name, type, capacity, price, description, startDate, endDate} = body
  const response = await csrfFetch(`/api/groups/${groupId}/events`, {
    method: 'POST',
    body: JSON.stringify({
      venueId,
      name,
      type,
      capacity,
      price,
      description,
      startDate,
      endDate
    })
  })
  if (response.ok) {
    const data = await response.json()
    dispatch(createEvent(data));
    return data
  }
}

const initialState = {};

const eventsReducer = (state = initialState, action) => {
  let newState;
  switch (action.type) {
    case GET_EVENTS:
      newState = Object.assign({}, state);
      newState.allEvents = {}
      action.events.Events.forEach(event => {
        newState.allEvents[event.id] = event
      });
      return newState;
    case GET_SINGLE_EVENT:
      newState = Object.assign({}, state);
      newState.singleEvent = action.event
      return newState;
    case CREATE_EVENT:
      newState = Object.assign({}, state);
      newState.allEvents[action.newEvent.id] = action.newEvent
      return newState
    default:
      return state;
  }
}

export default eventsReducer;