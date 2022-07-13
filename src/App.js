import React, { useState, useEffect } from 'react';
import './App.css';
import { API, Storage } from 'aws-amplify';
import { withAuthenticator, AmplifySignOut } from '@aws-amplify/ui-react-v1';
import { listEntries } from './graphql/queries';
import { createEntry as createEntryMutation, deleteEntry as deleteEntryMutation } from './graphql/mutations';

const initialFormState = { productId: '', productSource: '', productCategory: '', productUrl: '', lastFetchedDate: '' }

function App() {
  const [notes, setNotes] = useState([]);
  const [formData, setFormData] = useState(initialFormState);
  const amazonReviewPagePrefix = "https://www.amazon.com/PERLECARE-Adjustable-Weight-Bench-Workout/product-reviews/";
  const amazonReviewPageSuffix = "/ref=cm_cr_dp_d_show_all_btm?ie=UTF8&reviewerType=all_reviews";

  useEffect(() => {
    fetchEntries();
  }, []);

  async function fetchEntries() {
	const apiData = await API.graphql({ query: listEntries });
	setNotes(apiData.data.listEntries.items);
  }

  async function createEntry() {
	if (!formData.productId || !formData.productSource || !formData.productCategory) return;
	formData.productUrl = amazonReviewPagePrefix + formData.productId + amazonReviewPageSuffix;
	await API.graphql({ query: createEntryMutation, variables: { input: formData } });
	setNotes([ ...notes, formData ]);
	setFormData(initialFormState);
  }

  async function deleteEntry({ id }) {
    const newNotesArray = notes.filter(note => note.id !== id);
    setNotes(newNotesArray);
    await API.graphql({ query: deleteEntryMutation, variables: { input: { id } }});
  }

  return (
    <div className="App">
      <h1>TargetTap Internal Portal</h1>
      <input
        onChange={e => setFormData({ ...formData, 'productId': e.target.value})}
        placeholder="ProductId"
        value={formData.productId}
      />
      <input
        onChange={e => setFormData({ ...formData, 'productCategory': e.target.value})}
        placeholder="ProductCategory"
        value={formData.productCategory}
      />
	  <input
  		onChange={e => setFormData({ ...formData, 'productSource': e.target.value})}
		  placeholder="ProductSource"
		  value={formData.productSource}
	  />
      <button onClick={createEntry}>Submit</button>
      <div style={{marginBottom: 30}}>
	  {
		notes.map(note => (
			<div key={note.id || note.productId}>
			<h2>{note.productId}</h2>
			<p>{note.productCategory}</p>
			<p>{note.productUrl}</p>
			<button onClick={() => deleteEntry(note)}>Delete Entry</button>
			</div>
		))
		}
      </div>
      <AmplifySignOut />
    </div>
  );
}

export default withAuthenticator(App);