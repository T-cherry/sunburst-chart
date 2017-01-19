/**
 * Copyright 2016 IBM Corp. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/* eslint-disable no-console */

'use strict';
const _ = require('underscore');

class PersonalityProfile {

  constructor(profile) {
    this._traits = profile.personality;
    this._needs = profile.needs;
    this._values = profile.values;
    this._behaviors = profile.behavior ? profile.behavior : {};
  }

  /**
  * Creates a tree object matching the format used by D3 tree visualizations:
  *   each node in the tree must have a 'name' and 'children' attribute except leaf nodes
  *   which only require a 'name' attribute
  **/
  d3Json(){
    var d3Tree = {
      tree: {
        children: [
          {
            name: 'Big 5',
            id: 'personality',
            children: [this.traitsTree()]
          },
          {
            name: 'Values',
            id: 'values',
            children: [this.valuesTree()]
          },
          {
            name: 'Needs',
            id: 'needs',
            children: [this.needsTree()]
          }
        ]
      }
    };

    if( !_.isEmpty(this._behaviors) ){
      d3Tree.tree.children.push({
        name: 'Social Behavior',
        id: 'sbh',
        children: [this.behaviorsTree()]
      });
    }
    return d3Tree;

  }

  traitsTree(){
    var mostSignificantTrait = this.mostSignificantChild(this._traits);
    return {
      name: mostSignificantTrait.name,
      id: mostSignificantTrait.trait_id,
      category: mostSignificantTrait.category,
      score: mostSignificantTrait.percentile,
      children: this._traits.map(function(t) {
        return {
          name: t.name,
          id: t.trait_id,
          category: t.category,
          score: t.percentile,
          children: t.children.map(function(f) {
            return {
              name: f.name,
              id: f.trait_id,
              category: f.category,
              score: f.percentile
            };
          })
        };
      })
    };
  }


  needsTree(){
    var mostSignificantNeed = this.mostSignificantChild(this._needs);
    return {
      name: mostSignificantNeed.name,
      id: mostSignificantNeed.trait_id,
      category: mostSignificantNeed.category,
      score: mostSignificantNeed.percentile,
      children: this._needs.map(function(n) {
        return {
          name: n.name,
          id: n.trait_id,
          category: n.category,
          score: n.percentile
        };
      })
    };
  }

  valuesTree(){
    var mostSignificantValue = this.mostSignificantChild(this._values);
    return {
      name: mostSignificantValue.name,
      id: mostSignificantValue.trait_id,
      category: mostSignificantValue.category,
      score: mostSignificantValue.percentile,
      children: this._values.map(function(v) {
        return {
          name: v.name,
          id: v.trait_id,
          category: v.category,
          score: v.percentile
        };
      })
    };
  }

  behaviorsTree(){
    var mostSignificantBehavior = this.mostSignificantBehavior(this._behaviors);
    if (this._behaviors){
      return {
        name: mostSignificantBehavior.name,
        id: mostSignificantBehavior.trait_id,
        category: mostSignificantBehavior.category,
        score: mostSignificantBehavior.percentage,
        children: this._behaviors.map(function(b) {
          return {
            name: b.name,
            id: b.trait_id,
            category: b.category,
            score: b.percentage
          };
        })
      };
    } else {
      return {};
    }
  }

  mostSignificantChild(children){
    const threshold = 0.5;
    const farthestDistance = 0;
    var childWithScoreFarthestFromThreshold = {};

    for (var i = 0; i < children.length; i++) {
      if(Math.abs(children[i].percentile - threshold) >= farthestDistance){
        childWithScoreFarthestFromThreshold = children[i];
      }
    }
    return childWithScoreFarthestFromThreshold;
  }

  /**
  *   behaviors use 'percentage' instead of 'percentile' for score
  */
  mostSignificantBehavior(children){
    const threshold = 0.5;
    const farthestDistance = 0;
    var childWithScoreFarthestFromThreshold = {};

    for (var i = 0; i < children.length; i++) {
      if(Math.abs(children[i].percentage - threshold) >= farthestDistance){
        childWithScoreFarthestFromThreshold = children[i];
      }
    }
    return childWithScoreFarthestFromThreshold;
  }

}

module.exports = PersonalityProfile;
