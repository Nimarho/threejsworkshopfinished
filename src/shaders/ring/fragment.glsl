varying vec3 vColor;

void main()
{
    //float strength = 1.0 - step(0.5, abs(distance(gl_PointCoord, vec2(0.5))));
    float strength = distance(gl_PointCoord, vec2(0.5));
    //strength = step(0.5, strength);
    //strength *= 2.0;
    strength = 1.0 - strength;
    strength = pow(strength, 10.0);

    // Final color
    vec3 color = mix(vec3(0.0), vColor, strength);
    gl_FragColor = vec4(color, 1.0);

    gl_FragColor = vec4(color, 1.0);
}