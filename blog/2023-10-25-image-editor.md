---
title: 'Tutorial: scaling the image on rotation'
date: 2023-10-25
authors: [evgenia, tim]
image: '/img/blog/3.4-3.13/single-file-mode.jpg'
slug: '2023-10-25-image-editor'
published: true
toc_max_heading_level: 3
---

<!--retext-simplify disable prior-to all-of employ very represents-->

## Introduction

This is a tutorial blog post, I’ll be explaining how we implemented “image
scaling on rotation” in Uppy, and how you can implement it in your own image
editor.

Below you see how Uppy’s image editor handled image rotations prior to our
“scale on rotation” implementation, and how it handles it now.

<table style={{ textAlign: "center" }}>
  <thead>
  <tr>
    <th colspan={2}>
      Rotation
    </th>
  </tr>

  <tr>
    <th>Without scaling</th>
    <th>With scaling</th>
  </tr>
  </thead>

  <tbody>
  <tr>
  <td>
    <video controls muted autoplay>
      <source src="/img/blog/2023-10-25-image-editor/without-scaling.mov" type="video/mp4" />
    </video>
  </td>

  <td>
    <video controls muted autoplay>
      <source src="/img/blog/2023-10-25-image-editor/with-scaling.mov" type="video/mp4" />
    </video>
  </td>
  </tr>
  </tbody>
</table>

This UI is present in many image editors - for example, the default image
editors on ios and android both employ it. We implemented this in Uppy’s image
editor last week, and the solution turned out non-trivial. Bearing in mind this
is a pretty ubiquitous task to solve for image editors, we decided to write out
a post about it instead of leaving the solution in internal notes.

## 3 Steps

There are **3 steps** to scaling implementation:

1. ask your designer what scaling on rotation should look like,
1. find the `.scale()` function, and
1. pretty straightforward maths.

### Step 1: Ask Your Designer

When I approached this task, my first instinct was to go for the “rotated
rectangle inscribed within another rectangle” solution so that the largest-area
inscription possible is achieved. Absolutely do not follow this route, please
consult your designer (or transloadit founder in my case!) on what would
actually be a pleasant experience for the user.

Long-story short, we achieve the best “scaling on rotation” UI by:

- rotating the image around the center of the image (intersection of the
  diagonals)
- and just enlarging the image so that there are no checkered corners.

### Step 2: Find the `.scale()` Function

To enlarge the image in a way that covers checkered corners, we want some
scaling function. Uppy uses
[cropperjs v1.x](https://github.com/fengyuanchen/cropperjs) as an image editing
library, and it has a `cropper.scale(scalingFactor)` function. Any image editing
library is likely to have a similar function, or you’ll want to manually code it
up.

Your `.scale(scalingFactor)` should
[uniformly enlarge](<https://en.wikipedia.org/wiki/Scaling_(geometry)#Uniform_scaling>)
the image _around its center_, where the `scalingFactor` is determined by
`desiredHeight/oldHeight`.

### Step 3: Straightforward Maths

In the images below, we see what happens on rotation by default. To remove the
checkered corners, the user would have to drag around the edges of the
cropbox.  
What we can do instead is scale this image (in the directions shown by <span
style={{ color: `rgb(127, 194, 65)` }}>green arrows</span>) so that these
corners disappear.

<table style={{ background: `rgb(250, 250, 250)` }}>
  <thead>
  <tr><th colspan={2}>What happens on rotation</th></tr>
  </thead>

  <tbody>
  <tr>
  <td width="50%">
    <img style={{ maxWidth: 300 }} src="/img/blog/2023-10-25-image-editor/1a.png" />
  </td>

  <td width="50%">
    <img style={{ maxWidth: 340 }} src="/img/blog/2023-10-25-image-editor/1b.png" />
  </td>
  </tr>
  </tbody>
</table>

So, to cover up these checkered corners, we will need to scale the image. If we
cover up the larger corner, the smaller corner will get covered up
automatically, so our code takes the form of
`scale(Math.max(scalingFactor1, scalingFactor2))`.  
These two scaling factors are calculated very similarly, so we’ll only focus on
calculating only one of them in this tutorial (a full solution is given in the
conclusion too, however).

In the images below, the <span style={{ color: `rgb(127, 194, 65)` }}>green
rectangle</span> represents the desired dimensions of our image after it’s
scaled. Scaling operation is defined in such a way that our scaling factor is
`H/h`. We already know `h` (it’s the height of our image!), so we want to find
`H`.

<table style={{ background: "rgb(250, 250, 250)" }}>
  <thead>
  <tr><th colspan={2}>We want to find H</th></tr>
  </thead>

  <tbody>
  <tr>
  <td width="50%">
    <img src="/img/blog/2023-10-25-image-editor/2a.png" />
  </td>

  <td width="50%">
    <img src="/img/blog/2023-10-25-image-editor/2b.png" />
  </td>
  </tr>
  </tbody>
</table>

All of the next steps are automatic - we know all the angles in this image, we
know the image width and height, and we want to find `H`.

The easiest way to go about it is to first color all the corners on the
image - <span style={{ color: `rgb(26, 196, 213)` }}>blue</span> for our
rotation angle <code>α</code>,
and <span style={{ color: `rgb(224, 128, 193)` }}>pink</span>
for <code>90 - α</code>:

<table style={{ background: "rgb(250, 250, 250)", textAlign: "center" }}>
  <thead style={{ display: "table", width: "100%" }}>
  <tr><th>Color all angles</th></tr>
  </thead>

  <tbody style={{ display: "table", width: "100%" }}>
  <tr>
  <td>
    <img style={{ width: 500 }} src="/img/blog/2023-10-25-image-editor/3.png" />
  </td>
  </tr>
  </tbody>
</table>

and then find our `H` by adding two large-triangle sides:

<table style={{ background: "rgb(250, 250, 250)" }}>
  <thead>
  <tr><th colspan={2}>Add two triangle sides: H = sin(α - 90) * h + sin(α) * w</th></tr>
  </thead>

  <tbody>
  <tr>
  <td width="50%">
    <img src="/img/blog/2023-10-25-image-editor/4a.png" />
  </td>

  <td width="50%">
    <img src="/img/blog/2023-10-25-image-editor/4b.png" />
  </td>
  </tr>
  </tbody>
</table>

So, now we have our desired `H`! One of our scaling factors is `H/h`. Another
scaling factor of ours will be `W/w`, calculated similarly.  
The full solution will look as following:

```javascript
scalingFactor
= max(scalingFactor1, scalingFactor2)
= max(H/h, W/w)
= max(
  (sin(α - 90) * h + sin(α) * w) / h,
  (sin(α) * h + sin(α - 90) * w) / w
)
```

## Conclusion

In Uppy, our code ended up looking roughly like this:

```javascript
function getScalingFactor(w, h, rotationAngle) {
	const α = Math.abs(toRadians(rotationAngle));

	const scalingFactor = Math.max(
		(Math.sin(α) * w + Math.cos(α) * h) / h,
		(Math.sin(α) * h + Math.cos(α) * w) / w,
	);

	return scalingFactor;
}
const image = cropper.getImageData();
const scaleFactor = getScalingFactor(image.width, image.height, rotationAngle);
cropper.scale(scaleFactor);
```

You can see the full version
[on github](https://github.com/transloadit/uppy/blob/12e08ada02b9080bd5e1d19526bdf8a2010e62a1/packages/%40uppy/image-editor/src/utils/getScaleFactorThatRemovesDarkCorners.js).

<details>
  <summary>Bonus content: our founder’s (Tim Koschuetzki) scribble notes with the solution</summary>
  <img src="/img/blog/2023-10-25-image-editor/tim.jpg"/>
</details>
