import { csrfFetch } from './csrf';

const GET_GROUPS = 'groups/getGroups';
const GET_SINGLE_GROUP = 'group/getGroupById'
const CREATE_GROUP = 'group/getGroupById'
const DELETE_GROUP = 'group/deleteGroup'

const populateGroups = (groups) => {
  return {
    type: GET_GROUPS,
    groups
  };
};

const populateSingleGroup = (singleGroup) => {
  return {
    type: GET_SINGLE_GROUP,
    singleGroup
  }
};

const createGroup = (newGroup) => {
 return {
  type: CREATE_GROUP,
  newGroup
  }
};

const deleteSingleGroup = (groupId) => {
  return {
    type: DELETE_GROUP,
    groupId
  }
};





export const getGroups = () => async (dispatch) => {
  const response = await csrfFetch('/api/groups')
  if (response.ok){
    const data = await response.json();
  dispatch(populateGroups(data));
  return data
  };
};

export const getGroupById = (id) => async (dispatch) => {
  const response = await csrfFetch(`/api/groups/${id}`)
  if (response.ok){
    const data = await response.json();
    dispatch(populateSingleGroup(data));
    return data
  }
};

export const groupCreator = (body, userId) => async (dispatch) => {
  const {name, about, privateBoolean, type, city, state} = body
  const response = await csrfFetch('/api/groups', {
    method: 'POST',
    body: JSON.stringify({
      name,
      about,
      type,
      city,
      state,
      private: privateBoolean,
      organizerId: userId
    })
  })
  if (response.ok) {
    const data = await response.json()
    dispatch(createGroup(data));
    return data
  }
}

export const groupUpdater = (body, groupId) => async (dispatch) => {
  const {name, about, privateBoolean, type, city, state} = body
  const response = await csrfFetch(`/api/groups/${groupId}`, {
    method: 'PUT',
    body: JSON.stringify({
      name,
      about,
      type,
      city,
      state,
      private: privateBoolean,
    })
  })
  if (response.ok) {
    const data = await response.json()
    dispatch(getGroupById(data.id));
    return data
  }
}

export const groupDelete = (groupId) => async (dispatch) => {
  const response = await csrfFetch(`/api/groups/${groupId}`, {
    method: 'DELETE'
  })
  if (response.ok) {
    const data = await response.json()
    dispatch(deleteSingleGroup(groupId));
    return data
  }
}

const initialState = {};

const groupsReducer = (state = initialState, action) => {
  let newState;
  switch (action.type) {
    case GET_GROUPS:
      newState = Object.assign({}, state);
      newState.allGroups = {}
      action.groups.Groups.forEach(group => {
        newState.allGroups[group.id] = group
      });
      return newState;
    case GET_SINGLE_GROUP:
      newState = Object.assign({}, state);
      newState.singleGroup = action.singleGroup
      return newState;
    case CREATE_GROUP:
      newState = Object.assign({}, state);
      newState.allGroups[action.newGroup.id] = action.newGroup
      return newState
    case DELETE_GROUP:
      newState = Object.assign({}, state);
      delete newState.allGroups[action.groupId]
      newState.allGroups = Object.values(newState.allGroups).filter(id => id !==action.groupId)
      return newState;
    default:
      return state;
  }
};

export default groupsReducer;