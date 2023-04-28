import React from 'react';
import { useTracker } from 'meteor/react-meteor-data';
import { LinksCollection } from '../api/links';
import * as THREE from 'three';

export const Info = () => {
  const links = useTracker(() => {
    return LinksCollection.find().fetch();
  });
  return (
    <div>
      <h2>SMS : Léa</h2>

      {!(/Android|iPhone/i.test(navigator.userAgent)) && <>
        <br />
        <button onClick={() => {
          LinksCollection.insert({
            title: `Message ${links.length + 1}`
          })
        }}>Envoyer un message</button>

        <button onClick={() => {
          links.map((link) => {
            LinksCollection.remove({ _id: link._id })
          })
        }}>Clear</button>

      </>
      }

      <ul>{links.map(
        link => <li key={link._id}>
          <span style={{ backgroundColor: "cyan" }}>{link.title}</span>
        </li>
      )}</ul>
    </div>
  );
};